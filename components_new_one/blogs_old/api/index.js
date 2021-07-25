'use strict'
const path = require('path')
const service = require("../service")

const fetchBlogsType = async (request, h) => {
    try {
        const message = await service.fetchBlogsType(request)
        return response.data(h,message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}

const fetchblogdetail = async (request, h) => {
    try {
        // console.log('hiiiii',request.payload);
        const message = await service.fetchblogdetail(request.payload)
        // console.log('message===>',message)
        return response.data(h,message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}

exports.fetchBlogsType=fetchBlogsType
exports.fetchblogdetail=fetchblogdetail