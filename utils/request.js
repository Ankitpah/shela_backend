// File where every http comes and is served
'use strict'

const log = require('@open-age/logger')('exchange')
const plugin = {
    name: 'response',
    version: '1.0.0',

    register: async (server, options) => {
        server.ext('onPreStart', (server) => {
            log.verbose(`using environment: ${process.env.NODE_ENV || 'default'}`)
            log.verbose(`listening on port: ${process.env.PORT || server.info.port}`)
        })

        server.ext('onPostStart', (server) => {
            log.verbose(`server started : ${server.info.uri}`)
        })

        server.ext('onPreStop', (server) => {
            log.verbose(`stopping server on : ${server.info.uri}`)
        })

        server.ext('onPostStop', (server) => {
            log.verbose(`server stopped : ${server.info.uri}`)
        })

        server.ext('onRequest', (request, h) => {
            if (request.params) {
                log.verbose(`onRequest:${request.method.toUpperCase()}:${request.path}/${request.params}`)
            } else {
                log.verbose(`onRequest:${request.method.toUpperCase()}:${request.path}`)
            }

            if (Object.getOwnPropertyNames(request.query).length) {
                log.verbose(`onRequest:queryParameters: ${JSON.stringify(request.query)}`)
            }

            if (request.headers && request.headers['x-access-token']) {
                log.verbose(`onRequest:headers:x-access-token ${JSON.stringify(request.headers['x-access-token'])}`)
            }

            return h.continue
        })

        server.ext('onPreAuth', (request, h) => {
            // TODO: Handle preAuth Work log.verbose('onPreAuth')
            return h.continue
        })

        server.ext('onCredentials', (request, h) => {
            // TODO: Handle preAuth Work log.verbose('onCredentials')
            return h.continue
        })

        server.ext('onPostAuth', (request, h, error) => {
            if (request.payload && request.payload.file && request.payload.file.hapi) {
                log.verbose(`onPostAuth:bodyPayload: ${JSON.stringify(request.payload.file.hapi)}`)
                return h.continue
            }
            if (request.payload) {
                log.verbose(`onPostAuth:bodyPayload: ${JSON.stringify(request.payload)}`)
            }
            return h.continue
        })

        server.ext('onPreHandler', (request, h) => {
            // TODO: Handle preAuth Work log.verbose('onPreHandler')
            return h.continue
        })

        server.ext('onPostHandler', (request, h) => {
            // TODO: Handle preAuth Work log.verbose('onPostHandler')
            return h.continue
        })

        server.ext('onPreResponse', (request, h) => {
            if (request && request.response && request.response.source) {
                try {
                    //log.verbose(`onPreResponse:${JSON.stringify(request.response.source)}`)
                } catch (err) {
                    log.warn(err)
                    log.verbose(h.request.response.source.toString())
                }
            }
            return h.continue
        })
    }
}

exports.plugin = plugin