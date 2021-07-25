'use strict'
const path = require('path')
const service = require("../service")




const addServiceType = async (request, h) => {
    const log = logger.start('addServiceType:api:addServiceType')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.addServiceType(request.payload)
        log.end()
        return response.data(h,message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const fetchServiceType = async (request, h) => {
    const log = logger.start('industryType:api:fetchServiceType')
    try {
        //request.payload.userId = request.userInfo._id
        const message = await service.fetchServiceType(request)
        log.end()
        return response.data(h,message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



exports.addServiceType=addServiceType
exports.fetchServiceType=fetchServiceType