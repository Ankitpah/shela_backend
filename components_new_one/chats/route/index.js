/**
author : Simran
created_on : 21 Nov 2018
**/
'use strict'
const api = require('../api')
const specs = require('../specs')

module.exports = [{
        method: 'POST',
        path: '/api/chat/fetchMessages',
        options: specs.fetchMessages,
        handler: api.fetchMessages
    },
    {
        method: 'POST',
        path: '/api/chat/fetchInbox',
        options: specs.fetchInbox,
        handler: api.fetchInbox
    },
    {
        method: 'POST',
        path: '/api/chat/sendMessage',
        options: specs.sendMessage,
        handler: api.sendMessage
    },
    {
        method: 'POST',
        path: '/api/chat/uploadAttachment',
        options: specs.uploadAttachment,
        handler: api.uploadAttachment
    },
    {
        method: 'POST',
        path: '/api/chat/terminateChatRoom',
        options: specs.terminateChatRoom,
        handler: api.terminateChatRoom
    }
    ,
    {
        method: 'POST',
        path: '/api/chat/restartChatRoom',
        options: specs.restartChatRoom,
        handler: api.restartChatRoom
    }
]