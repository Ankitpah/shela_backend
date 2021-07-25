'use strict'
const validator = require('../validator')
const context = require('../../../utils/context-builder')

module.exports = {
    fetchNotifications: {
        description: 'Fetch notifications',
        notes: 'Fetch notifications',
        tags: ['api', 'notifications'],
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.fetchNotifications.query,
            failAction: response.failAction
        }
    },
    deleteNotification: {
        description: 'Delete a notification',
        notes: 'Delete a notification',
        tags: ['api', 'notifications'],
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.deleteNotification.payload,
            failAction: response.failAction
        }
    }
    ,

    testNotification: {
        description: 'Delete a notification',
        notes: 'Delete a notification',
        tags: ['api', 'notifications'],
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.testNotification.payload,
            failAction: response.failAction
        }
    }
}




