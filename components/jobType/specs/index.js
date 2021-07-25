"use strict"

 const validator = require('../validator')
 const context = require('../../../utils/context-builder')

 module.exports = {

    addJobType: {
        description: 'for adding JobType',
        notes: 'for adding JobType ',
        tags: ['api', 'JobType'],
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
            payload: validator.addJobType.payload,
            failAction: response.failAction
        }
    },


    searchJobType: {
        description: 'for searching JobType and  displaying',
        notes: 'for searching JobType ',
        tags: ['api', 'JobType'],
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
           // query: validator.searchJobType.query,
            failAction: response.failAction
        }
    }




 }