'use strict'

const moment = require('moment')

const populate = (doc) => {
    return new Promise((resolve, reject) => {
        doc.populate([{}], (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve()
        })
    })
}

exports.configure = (user) => {
    user.pre('save', function(next) {
        next()
    })

    user.post('save', async (doc) => {})

    user.pre('find', function(next) {
        next()
    })

    user.pre('findOne', function(next) {
        next()
    })
}