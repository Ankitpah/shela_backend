"use strict"

const validator = require('../validator')
const context = require('../../../utils/context-builder')

module.exports = {

    addCurrentPosition: {
        description: 'for adding CurrentPosition',
        notes: 'for adding CurrentPosition ',
        tags: ['api', 'CurrentPosition'],
        plugins: {
            'hapi-swagger': {
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
        validate: {
            headers: validator.header,
            payload: validator.addCurrentPosition.payload,
            failAction: response.failAction
        }
    },

    fetchCurrentPosition: {
        description: 'for fetching CurrentPosition',
        notes: 'for fetching CurrentPosition ',
        tags: ['api', 'CurrentPosition'],
        plugins: {
            'hapi-swagger': {
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
        validate: {
            headers: validator.header,
            query: validator.fetchCurrentPosition.query,
            failAction: response.failAction
        }
    }

}