// File for validating acess token
'use strict'
const auth = require('./auth')
const response = require('./responses')

const builder = (user, token) => {
    const context = {}
    context.user = user
    context.token = token

    return context
}

exports.validateToken = async (request, h) => {

    logger.start("Check accessToken")
    const token = request.headers['x-logintoken']

    if (!token) {
        return response.accessRevoked(h, 'user token is required')
    }
    const userId = await auth.verifyToken(token)

    if (!userId) {
        return response.accessRevoked(h, 'invalid token')
    }
    const user = await db.users.findById(userId.id)

    
    if ((!user) || (user && !user.isEmailVerified) || (user && user.isDeleted)) { 
        return response.accessRevoked(h, 'token expired')
    }

    const tokenExists = user.deviceDetails.accessToken === token


    if (!tokenExists) { 
        return response.accessRevoked(h, 'token expired')
    }

    request.userInfo = user

    return h
}

exports.requiresManipulation = async (request, h) => {
    if (!request.context) {
        request.context = {
            logger: require('@open-age/logger')()
        }
    }

    const manipulator = 'con' + request.route.settings.handler.name.charAt(0).toUpperCase() + request.route.settings.handler.name.slice(1)
    let source = request.route.settings.pre.find((value) => {
        return value.assign.split(':')[0] === 'manipulate'
    })

    source = source.assign.split(':')[1]
    if (!source) {
        return h
    }

    const isManipulator = require(`../components/${source}/middleware`)[manipulator]

    if (!isManipulator) {
        return h
    }

    try {
        return isManipulator(request, h)
    } catch (err) {
        return response.failure(h, err.message)
    }
}

// for use of sockets in chatting

exports.validateWithSocket = async (request, socket) => {


    const token = request.query['x-logintoken']



    if (!token) {
        throw new Error('user token is required')
    }

    const userId = await auth.verifyToken(token)

    if (!userId) {
        throw new Error('invalid token')
    }

    const user = await db.users.findById(userId.id)

    if ((!user) || (user && !user.isEmailVerified) || (user && user.isDeleted)) {
        throw new Error('Session expired ! Please login again')
    }

    const tokenExists = user.deviceDetails.accessToken === token

    if (!tokenExists) {
        throw new Error('token expired')
    }
    request.userInfo = user
    request.socketId = socket.id

    await db.users.findOneAndUpdate({ _id: user._id }, { "deviceDetails.socketId": socket.id }, { new: true })

    return request.userInfo
}