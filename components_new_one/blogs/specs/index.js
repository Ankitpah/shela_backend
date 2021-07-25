"use strict"

const validator = require('../validator')
const context = require('../../../utils/context-builder')
module.exports = {
    fetchblogdetail: {
        
        description: 'for adding Blogdetail',
        notes: 'for adding Blogdetail ',
        tags: ['api', 'Blogdetail'],
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
        validate: {
           headers: validator.header,
           payload: validator.fetchblogdetail.payload,
           failAction: response.failAction
        }
    },

}