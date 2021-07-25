// File for setting the server

'use strict'

const hapi = require('hapi')
global.logger = require('@open-age/logger')('boot') //here boot is the variable name which can be used to describe the file name
const serverConfig = require('config').get('webServer') //to get the configration
global.response = require('../utils/responses')
global.moment = require('moment')

const server = new hapi.server({
    port: process.env.PORT || serverConfig.port,
    host: serverConfig.host,
    routes: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['x-logintoken'],
            additionalExposedHeaders: ['x-logintoken']
        }
    }
})

const configurations = async () => {
    await require('../settings/preparation').configure(logger)
    await require('../settings/database').configure(logger)
    await require('../settings/redis').configure(logger)
    await require('../settings/hapi').configure(server, logger)
    await require('../settings/routes').configure(server, logger)
    await require('../settings/socket').configure(server)
    await require('../settings/swagger').configure(server, logger)
    init()
}

server.route({
    method: 'GET',
    path: '/file',
    options: {},
    handler: (req, res) => {
        return res.file('./index.html')
    }
})



const init = async () => {
    const log = logger.start('bin:server:init')
    await server.start()
    log.end()
}

process.on('unhandledRejection', (err) => {
    const log = logger.start('bin:server:unhandledRejection')
    log.error(err)
    //log.end()
    process.exit(1)
})

configurations()
