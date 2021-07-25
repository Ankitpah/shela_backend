/**
author : Simran
created_on : 21 Nov 2018
**/
'use strict'
const api = require('../api')
const specs = require('../specs')

module.exports = [{
    method: 'GET',
    path: '/api/invoices/fetchInvoices',
    options: specs.fetchInvoices,
    handler: api.fetchInvoices
}]