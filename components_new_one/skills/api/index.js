'use strict'
const path = require('path')
const service = require("../service")




const addSkills = async (request, h) => {
    const log = logger.start('skills:api:addSkills')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.addSkills(request.payload)
        log.end()
        return response.data(h,message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const searchSkills = async (request, h) => {
    const log = logger.start('skills:api:searchSkills')
    try {
        //request.query.userId = request.userInfo._id
        const message = await service.searchSkills(request)
        log.end()
        return response.data(h,message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


exports.searchSkills=searchSkills
exports.addSkills=addSkills