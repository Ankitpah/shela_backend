'use strict'
const fs = require('fs')
const exec = require('child_process').exec
const path = require('path')


const addServiceType = async (params) => {
    const log = logger.start(`serviceType:services:addServiceType`)
    const obj={
        name:params.name,
        addedAt:moment().unix()
    }
    //await db.create
    const data=await db.services(obj).save();
    log.end();
    return data;
}

const fetchServiceType = async (params) => {
    const log = logger.start(`serviceType:services:fetchServiceType`)
    const data= await db.services.find({}).sort({name: 1});
    log.end();
    return data;
}

exports.addServiceType=addServiceType
exports.fetchServiceType=fetchServiceType