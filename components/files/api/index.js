'use strict'
const path = require('path')
const service = require("../service")

const uploadFile = async (request, h) => {
    const log = logger.start('files:api:uploadFile')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.uploadFile(request)
        log.end()
        return response.data(h, { fileId: message._id })
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const fetchFile = async (request, h) => { 
    const log = logger.start('files:api:fetchFile')
    try {
        const message = await service.fetchFile(request.query)
        const type = request.query.type
        if(message == false && type == "file" ){
            const file1 = path.join(__dirname, '../../../assets/images/filenotfound.png');
            return h.file(file1)
        }else{
            const file = path.join(__dirname, '../../../assets/images/cdn/' + message.userId + "/" + message._id + "." + message.fileExtension);
            return h.file(file);
        }

    } catch (err) {
        log.error(err)
        return response.failure(h, err.message)
    }
}

const deleteFile = async (request, h) => {
    const log = logger.start('files:api:deleteFile')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.deleteFile(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


exports.uploadFile = uploadFile
exports.fetchFile = fetchFile
exports.deleteFile = deleteFile