'use strict'
const validator = require('../validator')
const context = require('../../../utils/context-builder')

module.exports = {
    addCard: {
        description: 'Add new card.',
        notes: 'Send stripe token for saving the card details obtained from frontend or stripe dashboard',
        tags: ['api', 'payment'],
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.addCard.payload,
            failAction: response.failAction
        }
    },
    isPaid: {
        description: ' For the employee to Checking Employer acces',
        notes: 'For self Checking Employer acces view by employee ',
        tags: ['api', 'employee'],
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
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
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
            // payload: validator.isPaid.payload,
            failAction: response.failAction
        }
    },

    fetchPlans: {
        description: 'for fetching plans.',
        notes: 'for fetching plans',
        tags: ['api', 'Plans'],
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
           // payload: validator.fetchPlans.payload,
            failAction: response.failAction
        }
    },
    
    editPlans: {
        description: 'for editing plans.',
        notes: 'for editing plans',
        tags: ['api', 'Plans'],
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.editPlans.payload,
            failAction: response.failAction
        }
    },
    
    
    deletePlan: {
        description: 'for deletePlan .',
        notes: 'for deletePlan ',
        tags: ['api', 'Plans'],
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.deletePlan.payload,
            failAction: response.failAction
        }
    },



    webhooks: {
        description: 'webhooks.',
        notes: 'webhooks',
        tags: ['api', 'webhooks'],
        // pre: [{
        //     method: context.validateToken,
        //     assign: 'token'
        // }],
        // validate: {
        //    // headers: validator.header,
        //     payload: validator.webhooks.payload,
        //     failAction: response.failAction
        // }
    },

    

    retreiveWebhook: {
        description: 'retreive Webhook.',
        notes: 'retreive Webhook',
        tags: ['api', 'webhooks'],
        // pre: [{
        //     method: context.validateToken,
        //     assign: 'token'
        // }],
        // validate: {
        //    // headers: validator.header,
        //    // payload: validator.retreiveWebhook.payload,
        //     failAction: response.failAction
        // }
    },

    planCreated: {
        description: 'planCreated Webhook.',
        notes: 'planCreated Webhook',
        tags: ['api', 'webhooks'],
        
    },
    // ,
    // addBankAccount: {
    //     description: 'Add bank details.',
    //     notes: 'Send all the required information',
    //     tags: ['api', 'payment'],
    //     pre: [{
    //         method: context.validateToken,
    //         assign: 'token'
    //     }],
    //     validate: {
    //         headers: validator.header,
    //         payload: validator.addBankAccount.payload,
    //         failAction: response.failAction
    //     }
    // },
    // listAllCards: {
    //     description: 'List all cards of user.',
    //     notes: 'List all cards from payment gateway',
    //     tags: ['api', 'payment'],
    //     pre: [{
    //         method: context.validateToken,
    //         assign: 'token'
    //     }],
    //     validate: {
    //         headers: validator.header,
    //         failAction: response.failAction
    //     }
    // }
}