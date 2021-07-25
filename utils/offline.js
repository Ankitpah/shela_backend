// File for sending emails in offline mode
'use strict'
var queueConfig = require('config').get('queueServer')
var appRoot = require('app-root-path')
var _ = require('underscore')
var async = require('async')
var fs = require('fs')
var paramCase = require('param-case')
let redisSMQ = require('rsmq')
var RSMQWorker = require('rsmq-worker')

let redisQueue = null

let options = {
    disabled: false,
    name: 'offline',
    port: 6379,
    host: '127.0.0.1',
    ns: 'offline',
    timeout: 30 * 60 * 1000, // 30 min
    processors: {
        dir: 'processors',
        default: {
            dir: 'defaults',
            file: 'default.js'
        }
    }
}
const setOptions = (config) => {
    options.disabled = config.disabled
    if (config.name) {
        options.name = config.name
    }
    if (config.port) {
        options.port = config.port
    }

    if (config.host) {
        options.host = config.host
    }

    if (config.ns) {
        options.ns = config.ns
    }

    if (config.timeout) {
        options.timeout = config.timeout
    }

    if (config.processors) {
        if (config.processors.dir) {
            options.processors.dir = config.processors.dir
        }

        if (config.processors.default) {
            if (config.processors.default.dir) {
                options.processors.default.dir = config.processors.default.dir
            }

            if (config.processors.default.file) {
                options.processors.default.file = config.processors.default.file
            }
        }
    }
}

let retry_strategy = (params) => {
    if (params.error && params.error.code === 'ECONNREFUSED') {
        // End reconnecting on a specific error and flush all commands with
        // a individual error
        return new Error('The server refused the connection')
    }
    if (params.total_retry_time > config.timeout) {
        // End reconnecting after a specific timeout and flush all commands
        // with a individual error
        return new Error('Retry time exhausted')
    }

    return 'dont-retry'
}

setOptions(queueConfig)

/**
 *
 * @param {*} params
 */
const initialize = function(params) {
    setOptions(params)
    if (!options.disabled) {
        redisQueue = new redisSMQ({
            host: options.host,
            port: options.port,
            options: {
                retry_strategy: retry_strategy
            },
            ns: options.ns
        })

        redisQueue.createQueue({
            qname: options.name,
            maxsize: -1
        }, function(err, resp) {
            if (err && err.message === 'Queue exists') {
                logger.info(`offline ${err.message}`)
            }
            if (resp === 1) {
                logger.info(`offline created`)
            }
        })
    }
}

const handleDefaultProcessors = (files, data, context, onDone) => {

    if (_.isEmpty(files)) {
        return onDone(null)
    }
    async.eachSeries(files, (file, cb) => {
        let handler = require(file)
        if (!handler.process) {
            return cb(null)
        }
        logger.debug('processing', {
            handler: file
        })
        handler.process(data, context, err => {
            if (err) {
                logger.error(err)
            }
            cb(err)
        })
    }, onDone)
}

const queueMessage = function(entity, action, data, context, callback) {
    redisQueue.sendMessage({
        qname: 'offline',
        message: JSON.stringify({
            context: context,
            entity: entity,
            action: action,
            data: data
        })
    }, function(err, messageId) {
        if (err) {
            logger.error(err)
        }
        if (messageId) {
            logger.debug(`message queued id: ${messageId}`)
        }
        if (callback) {
            callback(err, messageId)
            // listen();
        }
    })
}

const listen = function() {
    logger.info('listening for messages')
    var worker = new RSMQWorker(options.name, {
        rsmq: redisQueue,
        timeout: options.timeout
    })

    worker.on('error', function(err, message) {
        let log = logger.start('error')
        log.info(err)

        return aborted(message, err, function() {
            log.info('handled')
        })
    })

    worker.on('exceeded', function(message) {
        let log = logger.start('exceeded')

        return aborted(message, 'exceeded', function() {
            log.info('handled')
        })
    })

    worker.on('timeout', function(message) {
        let log = logger.start('timeout')

        return aborted(message, 'timeout', function() {
            log.info('handled')
        })
    })

    worker.on('message', function(message, next, id) {
        let log = logger.start(`processing-${id}`)
        return process(message, function(err) {
            if (err) {
                log.error(err)
            } else {
                log.debug('done')
            }
            next(err)
        })
    })

    worker.start()
}

const handleError = function(data, context, callback) {
    const root = `${appRoot}/${options.processors.dir}/${paramCase(context.entity)}/${paramCase(context.action)}`
    let log = logger.start(`handleError:${root}`)
    if (!fs.existsSync(root)) {
        return callback()
    }
    let errorHandlerFiles = []
    let file = `${root}/${options.processors.default.file}`
    if (fs.existsSync(file)) {
        errorHandlerFiles.push(file)
    }

    let errorHandlerDir = `${root}/${options.processors.default.dir}`
    if (fs.existsSync(errorHandlerDir)) {
        _.each(fs.readdirSync(errorHandlerDir), function(file) {
            if (file.search('.js') < 0) {
                logger.error(`${file} is not .js`)
                return
            }
            errorHandlerFiles.push(`${errorHandlerDir}/${file}`)
        })
    }

    if (_.isEmpty(errorHandlerFiles)) {
        log.debug('no error handler found')
        return callback(null)
    }

    async.eachSeries(errorHandlerFiles, (errorFile, cb) => {
        let handler = require(errorFile)
        if (!handler.onError) {
            return cb(null)
        }
        log.debug('handling-error', {
            handler: errorFile
        })
        handler.onError(data, context, err => {
            if (err) {
                log.error(err)
            }
            cb(err)
        })
    }, callback)
}

const handleMessage = function(data, context, callback) {
    const root = `${appRoot}/${options.processors.dir}/${paramCase(context.entity)}/${paramCase(context.action)}`

    if (!fs.existsSync(root)) {
        return callback()
    }
    let handlerFiles = []
    let file = `${root}/${options.processors.default.file}`

    if (fs.existsSync(file)) {
        handlerFiles.push(file)
    }

    let dir = `${root}/${options.processors.default.dir}`

    if (fs.existsSync(dir)) {
        _.each(fs.readdirSync(dir), function(file) {
            if (file.search('.js') < 0) {
                logger.error(`${file} is not .js`)
                return
            }
            handlerFiles.push(`${dir}/${file}`)
        })
    }
    handleDefaultProcessors(handlerFiles, data, context, callback)
}

const process = (message, 
    callback) => {
    var data = JSON.parse(message)



    if (!callback) {
        callback = (err) => {
            logger.error(err)
        }
    }
    data.context.entity = data.entity
    data.context.action = data.action
    return handleMessage(data.data, data.context, callback)
}

const aborted = (message, error, callback) => {
    let log = logger.start('aborted')
    log.debug(message)
    var data = JSON.parse(message.message)
    if (!callback) {
        callback = (err) => {
            logger.error(err)
        }
    }
    data.context.entity = data.entity
    data.context.action = data.action
    data.error = error
    return handleError(data.data, data.context, callback)
}
/**
 *
 * @param {string} entity
 * @param {string} action
 * @param {*} data
 * @param {*} context
 */
const queue = (entity, action, data, context) => {
    context.entity = entity
    context.action = action
    
    if (options.disabled || global.processSync || context.processSync) {
        logger.debug('immediately processing', {
            entity: entity,
            action: action
        })
        return new Promise((resolve, reject) => {
            handleMessage(data, context, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
    logger.debug('queuing for offline processing', {
        entity: entity,
        action: action
    })

    return new Promise((resolve, reject) => {
        queueMessage(entity, action, data, context, function(err) {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

exports.initialize = initialize
exports.queue = queue
exports.listen = listen