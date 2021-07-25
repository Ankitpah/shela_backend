'use strict'
const validator = require('../validator')
const context = require('../../../utils/context-builder')

module.exports = {
    subscribe: {
        description: 'For subscribing to a boost package',
        notes: 'for subscription and payment',
        tags: ['api', 'payment'],
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.subscribe.payload,
            failAction: response.failAction
        }
    },

    //createPlan
    createPlan: {
        description: 'For creating a plan',
        notes: 'For creating a plan',
        tags: ['api', 'plans'],
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.createPlan.payload,
            failAction: response.failAction
        }
    },
    getPlans: {
        description: 'For  get all plans',
        notes: 'Return the all plans',
        tags: ['api', 'plans'],
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            failAction: response.failAction
        }
    },













    // createBooking: {
    //     description: 'For booking a doctor for a timeslot',
    //     notes: 'A patient can book doctor for the availabilities.bookedFor is relation booking for.Send startTime n endTime as no. of seconds;slotsBooked array must always be sorted',
    //     tags: ['api', 'bookings'],
    //     pre: [{
    //         method: context.validateToken,
    //         assign: 'token'
    //     }],
    //     validate: {
    //         headers: validator.header,
    //         payload: validator.createBooking.payload,
    //         failAction: response.failAction
    //     }
    // },
    // reScheduleBooking: {
    //     description: 'Re-schedule a meeting',
    //     notes: 'Send booking id to be reschedule;slotsBooked array must always be sorted',
    //     tags: ['api', 'bookings'],
    //     pre: [{
    //         method: context.validateToken,
    //         assign: 'token'
    //     }],
    //     validate: {
    //         headers: validator.header,
    //         payload: validator.reScheduleBooking.payload,
    //         failAction: response.failAction
    //     }
    // },
    // cancelBooking: {
    //     description: 'Cancel a booking',
    //     notes: 'Doctor and patient both can cancel the booking anytime before start of call.',
    //     tags: ['api', 'bookings'],
    //     pre: [{
    //         method: context.validateToken,
    //         assign: 'token'
    //     }],
    //     validate: {
    //         headers: validator.header,
    //         payload: validator.cancelBooking.payload,
    //         failAction: response.failAction
    //     }
    // },
    // fetchBookings: {
    //     description: 'Fetch bookings according to the status',
    //     notes: 'Send status-upcoming,past,cancelled.',
    //     tags: ['api', 'bookings'],
    //     pre: [{
    //         method: context.validateToken,
    //         assign: 'token'
    //     }],
    //     validate: {
    //         headers: validator.header,
    //         query: validator.fetchBookings.query,
    //         failAction: response.failAction
    //     }
    // },
    // fetchTodaysBookings: {
    //     description: "Fetch bookings according to the date.Send today's date to access today's bookings",
    //     notes: 'To fetch todays bookings.Send time as unix timestamp',
    //     tags: ['api', 'bookings'],
    //     pre: [{
    //         method: context.validateToken,
    //         assign: 'token'
    //     }],
    //     validate: {
    //         headers: validator.header,
    //         query: validator.fetchTodaysBookings.query,
    //         failAction: response.failAction
    //     }
    // },
    // reviewAndRating: {
    //     description: "Review and Rate the doctor after call end",
    //     tags: ['api', 'bookings'],
    //     pre: [{
    //         method: context.validateToken,
    //         assign: 'token'
    //     }],
    //     validate: {
    //         headers: validator.header,
    //         payload: validator.reviewAndRating.payload,
    //         failAction: response.failAction
    //     }
    // },
    // fetchDetailsOfBooking: {
    //     description: "Api to fetch all information of a booking",
    //     tags: ['api', 'bookings'],
    //     pre: [{
    //         method: context.validateToken,
    //         assign: 'token'
    //     }],
    //     validate: {
    //         headers: validator.header,
    //         query: validator.fetchDetailsOfBooking.query,
    //         failAction: response.failAction
    //     }
    // }
}