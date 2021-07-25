"use strict"

 const validator = require('../validator')
 const context = require('../../../utils/context-builder')

 module.exports = {

    addIndustryType: {
        description: 'for adding IndustryType',
        notes: 'for adding IndustryType ',
        tags: ['api', 'IndustryType'],
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
            payload: validator.addIndustryType.payload,
            failAction: response.failAction
        }
    },

    fetchIndustryType: {
        description: 'for fetching IndustryType by name',
        notes: 'for fetching IndustryType ',
        tags: ['api', 'IndustryType'],
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