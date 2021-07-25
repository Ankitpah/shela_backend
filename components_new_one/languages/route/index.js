'use strict'
const api = require('../api')
const specs = require('../specs')





module.exports = [
    

{
    method: 'POST',
    path: '/api/languages/addLanguages',
    options: specs.addLanguages,
    handler: api.addLanguages
},
{
method: 'GET',
path: '/api/languages/fetchLanguages',
options: specs.fetchLanguages,
handler: api.fetchLanguages
}

]