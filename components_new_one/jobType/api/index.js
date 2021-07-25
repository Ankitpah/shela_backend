'use strict'
const path = require('path')
const service = require("../service")




const addJobType = async (request, h) => {
    const log = logger.start('jobType:api:addJobType')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.addJobType(request.payload)
        log.end()
        return response.data(h,message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const searchJobType = async (request, h) => {
    const log = logger.start('jobType:api:searchJobType')
    try {
       // request.query.userId = request.userInfo._id
        const message = await service.searchJobType(request)
        log.end()
        return response.data(h,message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


exports.searchJobType=searchJobType
exports.addJobType=addJobType