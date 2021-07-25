"use strict"

 const validator = require('../validator')
 const context = require('../../../utils/context-builder')

 module.exports = {

    addSkills: {
        description: 'for adding skills',
        notes: 'for adding skills ',
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
            payload: validator.addSkills.payload,
            failAction: response.failAction
        }
    },


    searchSkills: {
        description: 'for searching skills and displaying',
        notes: 'for searching skills ',
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
            //query: validator.searchSkills.query,
            failAction: response.failAction
        }
    }




 }