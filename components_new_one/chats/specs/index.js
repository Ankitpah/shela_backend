'use strict'
const validator = require('../validator')
const context = require('../../../utils/context-builder')

module.exports = {
    fetchMessages: {
        description: 'FetchMessages',
        notes: 'Fetch messages between 2 users',
        tags: ['api', 'chat'],
        validate: {
            payload: validator.fetchMessages.payload,
            failAction: response.failAction
        }
    },
    fetchInbox: {
        description: 'fetchInbox',
        notes: 'Fetch inbox of a user',
        tags: ['api', 'chat'],
        validate: {
            payload: validator.fetchInbox.payload,
            failAction: response.failAction
        }
    },
    sendMessage: {
        description: 'sendMessage',
        tags: ['api', 'chat'],
        validate: {
            payload: validator.sendMessage.payload,
            failAction: response.failAction
        }
    },
    uploadAttachment: {
        description: 'Upload file during chat',
        tags: ['api', 'chat'],
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        payload: validator.uploadAttachment.formPayload,
        validate: {
            payload: validator.uploadAttachment.payload,
            headers: validator.header,
            failAction: response.failAction
        }
    }
    
    ,
    terminateChatRoom: {
        description: 'terminate Chat Room',
        tags: ['api', 'chat'],
        validate: {
            payload: validator.terminateChatRoom.payload,
            failAction: response.failAction
        }
    },
    
    restartChatRoom: {
        description: 'restart Chat Room',
        tags: ['api', 'chat'],
        validate: {
            payload: validator.restartChatRoom.payload,
            failAction: response.failAction
        }
    },


}