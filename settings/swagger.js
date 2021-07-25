// File for configuring swagger
'use strict'

const swagger = require('hapi-swagger')

module.exports.configure = async (server, logger) => {
    const log = logger.start('settings:swagger:configure:REGISTERING HAPI - SWAGGER')

    const options = {
        info: {
            'title': 'Shela API Documentation',
            'version': '1.0.0'
        },
        schemes: ["https", "http", "ws", "wss"],
        pathPrefixSize: '1',
        basePath: '/api/',
        grouping: 'tags'
    }

    const builder = [{
        plugin: swagger,
        options: options
    }]

    await require('./hapi').register(server, builder, {
        logger: logger
    })

    log.end()
}
