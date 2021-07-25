//File for setting server configration

'use strict'
const inert = require('inert')
const vision = require('vision')
const hapiAuthCookie = require('hapi-auth-cookie')
const hapiHttps= require('hapi-require-https')
const request = require('../utils/request')

const configure = async (server, logger) => {
    const log = logger.start('settings:hapi:configure')
    //Registering the Hapi
    await server.register([
        request,
        inert,
        vision,
        hapiHttps,
        hapiAuthCookie
    ])
}

const register = async (server, entry, context) => {
    const log = context.logger.start('settings:hapi:register')

    await server.register(entry)
}

exports.register = register
exports.configure = configure