'use strict'
const path = require('path')
const service = require("../service")




const addIndustryType = async (request, h) => {
    const log = logger.start('industryType:api:addIndustryType')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.addIndustryType(request.payload)
        log.end()
        return response.data(h,message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const fetchIndustryType = async (request, h) => {
    const log = logger.start('industryType:api:addIndustryType')
    try {
        //request.payload.userId = request.userInfo._id
        const message = await service.fetchIndustryType(request)
        log.end()
        return response.data(h,message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



exports.addIndustryType=addIndustryType
exports.fetchIndustryType=fetchIndustryType