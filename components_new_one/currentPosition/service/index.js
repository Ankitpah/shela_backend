'use strict'
const fs = require('fs')
const exec = require('child_process').exec
const path = require('path')

const addCurrentPosition = async (params) => {
    const log = logger.start(`currentPosition:services:addCurrentPosition`)
    const obj = {
        name: params.name,
        addedAt: moment().unix()
    }
    const data = await db.currentPosition(obj).save();
    log.end();
    return data;
}


const fetchCurrentPosition = async (params) => {
    const log = logger.start(`CurrentPosition:services:fetchCurrentPosition`)
    var criteria={}
    if(params.name && params.name != "")
        criteria = {name : new RegExp(params.name,"i")}
    const data = await db.currentPosition.find(criteria).sort({name: 1});
    return data;
}

exports.fetchCurrentPosition = fetchCurrentPosition
exports.addCurrentPosition = addCurrentPosition