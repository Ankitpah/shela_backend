const service = require('../service')


const fetchInvoices = async (request, h) => {
    try {
        request.query.userInfo = request.userInfo
        const message = await service.fetchInvoices(request.query)
        return response.paged(h, message.data,message.totalRecords)
    } catch (err) {
        return response.failure(h, err.message)
    }
}

exports.fetchInvoices = fetchInvoices