//File for initialising offline for sending emails


'use strict'
global.offline = require('../utils/offline')
const redisConfig = require('config').get('queueServer')

exports.configure = async (logger) => {
    const log = logger.start('settings:redis:configure')
    global.processSync = true // set true to not to use redis

    if (!global.processSync) {
        log.info('configuring redis ..')
        await offline.initialize(redisConfig, log)
        log.info('redis configured')
        log.end()
        return
    }

    log.info('redis bypass')
    log.end()
}