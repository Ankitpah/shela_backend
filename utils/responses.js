// Common file for sending and calling responses
'use strict'

const success = (h, message) => {
    const res = h.response({
        isSuccess: true,
        status: 'success',
        statusCode: 200,
        message: message
    })
    res.code(200)
    return res
}
const page = (h, items, pageSize, pageNo, total) => {
    const res = h.response({
        isSuccess: true,
        status: 'success',
        statusCode: 200,
        pageNo: pageNo || 1,
        items: items,
        pageSize: pageSize || items.length,
        count: total
    })
    res.code(200)
    return res
}

const dataPaged = (h, data, pageSize, pageNo, total) => {
    const res = h.response({
        isSuccess: true,
        status: 'success',
        statusCode: 200,
        pageNo: pageNo || 1,
        data: data,
        pageSize: pageSize,
        count: total
    })
    res.code(200)
    return res
}

const data = (h, item) => {
    const res = h.response({
        isSuccess: true,
        status: 'success',
        statusCode: 200,
        data: item
    })
    res.code(200)
    return res
}

const dataCount = (h, item) => {
    const res = h.response({
        isSuccess: true,
        status: 'success',
        statusCode: 200,
        totalCount: item.totalCount,
        data: item.data
    })
    res.code(200)
    return res
}

const paged = (h, item, totalRecords) => {
    const res = h.response({
        isSuccess: true,
        status: 'success',
        statusCode: 200,
        totalRecords: totalRecords,
        data: item
    })
    res.code(200)
    return res
}


const failure = (h, message) => {
    const res = h.response({
        isSuccess: false,
        status: 'failure',
        statusCode: 320,
        message: message
    })
    res.code(320)
    res.takeover()
    return res
}
const accessDenied = (h, message) => {
    const res = h.response({
        isSuccess: false,
        status: 'failure',
        statusCode: 403,
        message: message
    })
    res.code(403)
    res.takeover()
    return res
}
const accessRevoked = (h, message) => {
    const res = h.response({
        isSuccess: false,
        status: 'failure',
        statusCode: 406,
        message: message
    })
    res.code(406)
    res.takeover()
    return res
}

const versionUpdate = (h, message) => {
    const res = h.response({
        isSuccess: false,
        status: 'failure',
        statusCode: 408,
        message: message
    })
    res.code(408)
    res.takeover()
    return res
}
const accessGranted = (h, user, token) => {
    const res = h.response({
        status: 'success',
        statusCode: 200,
        message: 'Successfully Login',
        data: user
    })
    res.header('x-access-token', token)
    return res
}
const error = (h) => {
    const res = h.response({
        status: 'error',
        statusCode: 500,
        message: 'Technical Error! Please try again later.'
    })
    res.code(500)
    res.takeover()
    return res
}
const failAction = (request, h, error) => {
    let customErrorMessage = ''
    if (error.output.payload.message.indexOf('[') > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.lastIndexOf('['))
    } else {
        customErrorMessage = error.output.payload.message
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '')
    customErrorMessage = customErrorMessage.replace('[', '')
    customErrorMessage = customErrorMessage.replace(']', '')
    customErrorMessage = customErrorMessage.replace(']', '')
    const res = h.response({
        isSuccess: false,
        status: 'failure',
        statusCode: 320,
        message: customErrorMessage
    })
    res.code(320)
    res.takeover()
    return res
}
const accessDeniedAction = (request, h, error) => {
    let customErrorMessage = ''
    if (error.output.payload.message.indexOf('[') > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.lastIndexOf('['))
    } else {
        customErrorMessage = error.output.payload.message
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '')
    customErrorMessage = customErrorMessage.replace('[', '')
    customErrorMessage = customErrorMessage.replace(']', '')
    customErrorMessage = customErrorMessage.replace(']', '')
    const res = h.response({
        isSuccess: false,
        status: 'failure',
        statusCode: 403,
        message: customErrorMessage
    })
    res.code(403)
    res.takeover()
    return res
}


const searchFailure = (h, message) => {
    const res = h.response({
        isSuccess: success,
        status: 'success',
        statusCode: 403,
        message: message
    })
    res.code(403)
    res.takeover()
    return res
}






exports.page = page
exports.data = data
exports.dataCount = dataCount
exports.paged = paged
exports.error = error
exports.failure = failure
exports.success = success
exports.dataPaged = dataPaged
exports.failAction = failAction
exports.accessDenied = accessDenied
exports.searchFailure = searchFailure
exports.accessRevoked = accessRevoked
exports.accessGranted = accessGranted
exports.versionUpdate = versionUpdate
exports.accessDeniedAction = accessDeniedAction