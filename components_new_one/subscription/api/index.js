'use strict'

const service = require('../service')
const path = require('path')


const subscribe = async (request, h) => {
    try {
        request.payload.userInfo = request.userInfo
        const message = await service.subscribe(request.payload)
        return response.success(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}



const createPlan = async (request, h) => {
    try {
        request.payload.userInfo = request.userInfo
        const message = await service.createPlan(request.payload)
        return response.success(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}


const getPlans = async (request, h) => {
    try {
        const message = await service.getPlans(request)
        return response.success(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}






exports.subscribe = subscribe
exports.createPlan = createPlan
exports.getPlans = getPlans









// const createBooking = async (request, h) => {
//     try {
//         request.payload.userInfo = request.userInfo
//         const message = await service.createBooking(request.payload)
//         return response.success(h, message)
//     } catch (err) {
//         return response.failure(h, err.message)
//     }
// }
// const reScheduleBooking = async (request, h) => {
//     try {
//         request.payload.userInfo = request.userInfo
//         const message = await service.reScheduleBooking(request.payload)
//         return response.success(h, message)
//     } catch (err) {
//         return response.failure(h, err.message)
//     }
// }
// const cancelBooking = async (request, h) => {
//     try {
//         request.payload.userInfo = request.userInfo
//         const message = await service.cancelBooking(request.payload)
//         return response.success(h, message)
//     } catch (err) {
//         return response.failure(h, err.message)
//     }
// }
// const fetchBookings = async (request, h) => {
//     try {
//         request.query.userInfo = request.userInfo
//         const message = await service.fetchBookings(request.query)
//         return response.paged(h, message, message.totalCount)
//     } catch (err) {
//         return response.failure(h, err.message)
//     }
// }
// const fetchTodaysBookings = async (request, h) => {
//     try {
//         request.query.userInfo = request.userInfo
//         const message = await service.fetchTodaysBookings(request.query)
//         return response.paged(h, message, message.totalCount)
//     } catch (err) {
//         return response.failure(h, err.message)
//     }
// }
// const reviewAndRating = async (request, h) => {
//     try {
//         request.payload.userInfo = request.userInfo
//         const message = await service.reviewAndRating(request.payload)
//         return response.success(h, message)
//     } catch (err) {
//         return response.failure(h, err.message)
//     }
// }
// const fetchDetailsOfBooking = async (request, h) => {
//     try {
//         request.query.userInfo = request.userInfo
//         const message = await service.fetchDetailsOfBooking(request.query)
//         return response.success(h, message)
//     } catch (err) {
//         return response.failure(h, err.message)
//     }
// }

// exports.createBooking = createBooking
// exports.reScheduleBooking = reScheduleBooking
// exports.cancelBooking = cancelBooking
// exports.fetchBookings = fetchBookings
// exports.fetchTodaysBookings = fetchTodaysBookings
// exports.reviewAndRating = reviewAndRating
// exports.fetchDetailsOfBooking = fetchDetailsOfBooking