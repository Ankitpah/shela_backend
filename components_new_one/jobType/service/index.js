'use strict'
const fs = require('fs')
const exec = require('child_process').exec
const path = require('path')


const addJobType = async (params) => {
    const log = logger.start(`jobType:service:addJobType`)


    const obj={
        name:params.name,
        addedAt:moment().unix()

    }
    //await db.create
    const data=await db.jobType(obj).save()

    log.end()
    return data

}


const searchJobType = async (params) => {
    const log = logger.start(`jobType:service:searchJobType`)
    const data= await db.jobType.find({}).sort({name: 1});
    log.end()
    return data;
}


exports.searchJobType=searchJobType
exports.addJobType=addJobType