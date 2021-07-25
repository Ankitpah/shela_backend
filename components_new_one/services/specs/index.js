"use strict"

 const validator = require('../validator')
 const context = require('../../../utils/context-builder')

 module.exports = {

    addServiceType: {
        description: 'for adding ServiceType',
        notes: 'for adding ServiceType ',
        tags: ['api', 'ServiceType'],
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
            payload: validator.addServiceType.payload,
            failAction: response.failAction
        }
    },

    fetchServiceType: {
        description: 'for fetching ServiceType',
        notes: 'for fetching ServiceType ',
        tags: ['api', 'ServiceType'],
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
           // payload: validator.fetchIndustryType.payload,
            failAction: response.failAction
        }
    }



 }