'use strict'
const api = require('../api')
const specs = require('../specs')





module.exports = [{
        method: 'POST',
        path: '/api/currentPosition/addCurrentPosition',
        options: specs.addCurrentPosition,
        handler: api.addCurrentPosition
    },
    {
        method: 'GET',
        path: '/api/currentPosition/fetchCurrentPosition',
        options: specs.fetchCurrentPosition,
        handler: api.fetchCurrentPosition
    }
    // {
    //     method: 'DELETE',
    //     path: '/api/files/deleteFile',
    //     options: specs.deleteFile,
    //     handler: api.deleteFile
    // }
]