/**
author : Simran
created_on : 12 Dec 2018
**/
'use strict'
const api = require('../api')
const specs = require('../specs')

module.exports = [
    {
        method: 'POST',
        path:'/api/payment/subscribe',
        options: specs.subscribe,
        handler: api.subscribe
    }
    ,
    {
        method: 'POST',
        path:'/api/stripe/createPlan',
        options: specs.createPlan,
        handler: api.createPlan
    },
    {
        method: 'GET',
        path:'/api/stripe/getPlans',
        options: specs.getPlans,
        handler: api.getPlans
    }





    // {
    //     method: 'POST',
    //     path: '/api/bookings/createBooking',
    //     options: specs.createBooking,
    //     handler: api.createBooking
    // }, {
    //     method: 'POST',
    //     path: '/api/bookings/reScheduleBooking',
    //     options: specs.reScheduleBooking,
    //     handler: api.reScheduleBooking
    // }, {
    //     method: 'POST',
    //     path: '/api/bookings/cancelBooking',
    //     options: specs.cancelBooking,
    //     handler: api.cancelBooking
    // }, {
    //     method: 'GET',
    //     path: '/api/bookings/fetchBookings',
    //     options: specs.fetchBookings,
    //     handler: api.fetchBookings
    // },
    // {
    //     method: 'GET',
    //     path: '/api/bookings/fetchTodaysBookings',
    //     options: specs.fetchTodaysBookings,
    //     handler: api.fetchTodaysBookings
    // }, {
    //     method: 'POST',
    //     path: '/api/bookings/reviewAndRating',
    //     options: specs.reviewAndRating,
    //     handler: api.reviewAndRating
    // }, {
    //     method: 'GET',
    //     path: '/api/bookings/fetchDetailsOfBooking',
    //     options: specs.fetchDetailsOfBooking,
    //     handler: api.fetchDetailsOfBooking
    // }
]