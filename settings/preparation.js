// This file checks if assests and logs folder exists

'use strict'
const fs = require('fs')
const appRoot = require('app-root-path')


const logFolderExists = () => {
    try {
        fs.statSync(`${appRoot.path}/logs/`)
        return true
    } catch (err) {
        return false
    }
}

const assetsFolderExists = () => {
    try {
        fs.statSync(`${appRoot.path}/assets/`)
        return true
    } catch (err) {
        return false
    }
}

exports.configure = (logger) => {
    const log = logger.start('settings:preparation:configure')

    if (!logFolderExists()) {
        fs.mkdirSync(`${appRoot.path}/logs/`)
    }
    if (!assetsFolderExists()) {
        fs.mkdirSync(`${appRoot.path}/assets/`)
    }
    log.end()
}