'use strict'
const api = require('../api')
const specs = require('../specs')

module.exports = [{
    method: 'GET',
    path: '/api/blogsType/fetchBlogsType',
    handler: api.fetchBlogsType
},
{
    method: 'POST',
    path: '/api/blog/fetchblogdetail',
    options: specs.fetchblogdetail,
    handler: api.fetchblogdetail
}
]