'use strict'
const path = require('path')
const service = require("../service")




const addCurrentPosition = async (request, h) => {
    const log = logger.start('currentPosition:api:addCurrentPosition')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.addCurrentPosition(request.payload)
        log.end()
        return response.data(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const fetchCurrentPosition = async (request, h) => {
    const log = logger.start('currentPosition:api:fetchCurrentPosition')
    try {
        request.query.userId = request.userInfo._id
        const message = await service.fetchCurrentPosition(request.query)
        log.end()
        return response.data(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


exports.addCurrentPosition = addCurrentPosition
exports.fetchCurrentPosition = fetchCurrentPosition