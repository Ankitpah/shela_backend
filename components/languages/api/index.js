'use strict'
const path = require('path')
const service = require("../service")



const addLanguages = async (request, h) => {
    const log = logger.start('skillsLanguages:api:addLanguages')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.addLanguages(request.payload)
        log.end()
        return response.data(h,message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const fetchLanguages = async (request, h) => {
    const log = logger.start('skillsLanguages:api:fetchLanguages')
    try {
        request.query.userId = request.userInfo._id
        const message = await service.fetchLanguages(request.query)
        log.end()
        return response.data(h,message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

exports.addLanguages=addLanguages
exports.fetchLanguages=fetchLanguages