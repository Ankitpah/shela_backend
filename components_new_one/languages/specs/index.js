"use strict"

 const validator = require('../validator')
 const context = require('../../../utils/context-builder')

 module.exports = {

    addLanguages: {
        description: 'for adding languagess',
        notes: 'for adding languages',
        tags: ['api', 'skillsAndLanguages'],
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
            payload: validator.addLanguages.payload,
            failAction: response.failAction
        }
    }, 
    fetchLanguages: {
        description: 'for fetching languagess',
        notes: 'for fetching languages',
        tags: ['api', 'skillsAndLanguages'],
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
            query: validator.fetchLanguages.query,
            failAction: response.failAction
        }
    },




 }