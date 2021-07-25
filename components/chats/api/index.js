const service = require('../service')

const fetchMessages = async (request, h) => {
    try {
        const message = await service.fetchMessages(request.payload)
        return response.dataCount(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}
const fetchInbox = async (request, h) => {
    try {
        const message = await service.fetchInbox(request.payload)
        return response.data(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}
const sendMessage = async (request, h) => {
    try {
        const message = await service.sendMessage(request.payload)
        return response.data(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}

const uploadAttachment = async (request, h) => {
    try {
        request.payload.userId = request.userInfo
        const message = await service.uploadAttachment(request)
        return response.success(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}



const terminateChatRoom = async (request, h) => {
    try {
        const message = await service.terminateChatRoom(request.payload)
        return response.data(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}

const restartChatRoom = async (request, h) => {
    try {
        const message = await service.restartChatRoom(request.payload)
        return response.data(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}



exports.fetchMessages = fetchMessages
exports.fetchInbox = fetchInbox
exports.sendMessage = sendMessage
exports.uploadAttachment = uploadAttachment
exports.terminateChatRoom = terminateChatRoom
exports.restartChatRoom = restartChatRoom