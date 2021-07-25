'use strict'
const api = require('../api')
const specs = require('../specs')

module.exports = [{
    method: 'POST',
    path: '/api/industryType/addIndustryType',
    options: specs.addIndustryType,
    handler: api.addIndustryType
},
{
    method: 'GET',
    path: '/api/industryType/fetchIndustryType',
    options: specs.fetchIndustryType,
    handler: api.fetchIndustryType
}
]