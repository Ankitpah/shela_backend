'use strict'
const validator = require('../validator')
const context = require('../../../utils/context-builder')

module.exports = {
    fetchInvoices: {
        description: 'use api to fetch invoices',
        notes: 'use api to fetch invoices',
        tags: ['api', 'invoices'],
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.fetchInvoices.query,
            failAction: response.failAction
        }
    },
}