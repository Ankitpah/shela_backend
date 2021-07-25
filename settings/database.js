//File for setting database
'use strict'

const dbServer = require('config').get('dbServer')
global.mongoose = require('mongoose')
// mongoose.set('debug', true) // For logging queries


module.exports.configure = async (logger) => {
    const log = logger.start('database:configure')
    //logs will start , if we dont write start function logs can sill be printed but it wont show like
    //[boot:database:configure] started
    //info: [boot:database:configure] DB Connected on 

    try {
        await mongoose.connect(dbServer.url, dbServer.option)

        await require('../components').models(log)
        global.db = mongoose.models

        log.info(`DB Connected on ====== ${dbServer.url}`)
        log.end() //end fxn will print the time taken by the fucntion to execute
    } catch (err) {
        log.error('DB Connection Failed===', err)
        log.end()
    }
}