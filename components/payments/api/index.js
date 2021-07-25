const service = require('../service')


const addCard = async (request, h) => {
    try {
        request.payload.userInfo = request.userInfo
        const message = await service.addCard(request.payload)
        return response.success(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}

const isPaid = async (request, h) => {
    try {
        const message = await service.isPaid(request)
        return response.success(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}

const webhooks = async (request, h) => {
    try {
        request.payload.userInfo = request.userInfo
        const message = await service.webhooks(request.payload)
        return response.success(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}

const retreiveWebhook = async (request, h) => {
    try {
        request.payload.userInfo = request.userInfo
        const message = await service.retreiveWebhook(request.payload)
        return response.success(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}

const planCreated = async (request, h) => {
    try {
        request.payload.userInfo = request.userInfo
        const message = await service.planCreated(request.payload)
        return response.success(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}


const fetchPlans = async (request, h) => {
    try {
        const message = await service.fetchPlans(request)
        return response.success(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}


const editPlans = async (request, h) => {
    try {
        const message = await service.editPlans(request.payload)
        return response.success(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}



const deletePlan = async (request, h) => {
    try {
        const message = await service.deletePlan(request.payload)
        return response.success(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}


exports.addCard = addCard
exports.isPaid = isPaid
//exports.createSubscription=createSubscription
// exports.addBankAccount = addBankAccount
// exports.listAllCards = listAllCards
exports.webhooks=webhooks
exports.planCreated=planCreated
exports.retreiveWebhook=retreiveWebhook
exports.fetchPlans=fetchPlans
exports.editPlans=editPlans
exports.deletePlan=deletePlan