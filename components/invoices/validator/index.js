'use strict'
const Joi = require('joi')

module.exports = {
    fetchInvoices: {
        query: {
        	skip : Joi.number(),
        	limit : Joi.number()
        }
    },
    header: Joi.object({
        'x-logintoken': Joi.string().required().trim().description('Provide token to access api')
    }).unknown()
}