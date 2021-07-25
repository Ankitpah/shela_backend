'use strict'
const api = require('../api')
const specs = require('../specs')

module.exports = [{
    method: 'POST',
    path: '/api/addServiceType/addServiceType',
    options: specs.addServiceType,
    handler: api.addServiceType
},
{
    method: 'GET',
    path: '/api/fetchServiceType/fetchServiceType',
    options: specs.fetchServiceType,
    handler: api.fetchServiceType
}
]