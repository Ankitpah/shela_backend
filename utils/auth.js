// File for validations and authentications

'use strict'

const md5 = require('md5')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('config').get('token')

const getHash = (password) => {
    let hash = crypto.createHmac('sha512', config.secret) /** Hashing algorithm sha512 */
    hash.update(password)
    return hash.digest('hex')
}

const compareHash = (password, hash) => {
    let decryptHash = crypto.createHmac('sha512', config.secret) /** Hashing algorithm sha512 */
    decryptHash.update(password)
    if (hash === decryptHash.digest('hex')) {
        return true
    }
    return false
}

const createToken = (id) => {
    const token = jwt.sign({
        id: id
    }, config.secret)
    return token
}

const randomToken = (value) => {
    const valueWithTimeStamp = value + Date.now()

    return md5(valueWithTimeStamp)
}

const verifyToken = async (token) => {
    return new Promise((resolve, reject) => {
        return jwt.verify(token, config.secret, (err, user) => {
            if (err) {
                return resolve(false)
            }
            return resolve(user)
        })
    })
}

exports.getHash = getHash
exports.compareHash = compareHash
exports.createToken = createToken
exports.verifyToken = verifyToken
exports.randomToken = randomToken