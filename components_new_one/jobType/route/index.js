'use strict'
const api = require('../api')
const specs = require('../specs')

module.exports = [
    {
    method: 'POST',
    path: '/api/jobType/addJobType',
    options: specs.addJobType,
    handler: api.addJobType
},
{
    method: 'GET',
    path: '/api/jobType/searchJobType',
    options: specs.searchJobType,
    handler: api.searchJobType
}
]