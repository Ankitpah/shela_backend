/**
author : Simran
created_on : 14 Nov 2018
**/
'use strict'
const api = require('../api')
const specs = require('../specs')


module.exports = [{
        method: 'POST',
        path: '/api/files/uploadFile',
        options: specs.uploadFile,
        handler: api.uploadFile
    },
    {
        method: 'GET',
        path: '/api/files/fetchFile',
        options: specs.fetchFile,
        handler: api.fetchFile
    },
    {
        method: 'DELETE',
        path: '/api/files/deleteFile',
        options: specs.deleteFile,
        handler: api.deleteFile
    }
]