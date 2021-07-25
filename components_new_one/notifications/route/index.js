/**
author : Simran
created_on : 21 Nov 2018
**/
'use strict'
const api = require('../api')
const specs = require('../specs')

module.exports = [{
    method: 'GET',
    path: '/api/notifications/fetchNotifications',
    options: specs.fetchNotifications,
    handler: api.fetchNotifications
}, 
{
    method: 'POST',
    path: '/api/notifications/deleteNotification',
    options: specs.deleteNotification,
    handler: api.deleteNotification
},
{
    method: 'POST',
    path: '/api/notifications/testNotification',
    options: specs.testNotification,
    handler: api.testNotification
}
]