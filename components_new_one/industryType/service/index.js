'use strict'
const fs = require('fs')
const exec = require('child_process').exec
const path = require('path')


const addIndustryType = async (params) => {
    const log = logger.start(`industryType:services:addIndustryType`)
    const obj={
        name:params.name,
        addedAt:moment().unix()
    }
    //await db.create
    const data=await db.industryType(obj).save()
    log.end()
    return data
}
const fetchIndustryType = async (params) => {
    const log = logger.start(`industryType:services:fetchIndustryType`)
    const data= await db.industryType.find({}).sort({name: 1});
    log.end();
    return data;
}


exports.addIndustryType=addIndustryType
exports.fetchIndustryType=fetchIndustryType