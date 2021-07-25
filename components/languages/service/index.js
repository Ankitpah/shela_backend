'use strict'
const fs = require('fs')
const exec = require('child_process').exec
const path = require('path')



const addLanguages = async (params) => {
    const log = logger.start(`languages:services:addLanguages`)


    const obj={
        name:params.name,
        addedAt:moment().unix()

    }

    const data=await db.languages(obj).save()

    log.end()
    return data

}

const fetchLanguages = async (params) => {
    const log = logger.start(`languages:services:fetchLanguages`)
    const data= await db.languages.find({}).sort({name: 1});
    log.end();
    return data;
}



exports.addLanguages=addLanguages
exports.fetchLanguages=fetchLanguages