'use strict'
const fs = require('fs')
const exec = require('child_process').exec
const path = require('path')


const addSkills = async (params) => {
    const log = logger.start(`skillsLanguages:services:addSkills`)
    const obj={
        name:params.name,
        addedAt:moment().unix()
    }
    //await db.create
    const data=await db.skills(obj).save();
    log.end();
    return data;
}


const searchSkills = async (params) => {
    const log = logger.start(`skills:services:searchSkills`)
    const data= await db.skills.find({}).sort({name: 1});    
    log.end();
    return data;
}


exports.searchSkills=searchSkills
exports.addSkills=addSkills