'use strict'
const api = require('../api')
const specs = require('../specs')





module.exports = [{
    method: 'POST',
    path: '/api/skills/addSkills',
    options: specs.addSkills,
    handler: api.addSkills
},
{
    method: 'GET',
    path: '/api/skills/searchSkills',
    options: specs.searchSkills,
    handler: api.searchSkills
}
]