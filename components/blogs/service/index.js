'use strict'
const fs = require('fs')
// const exec = require('child_process').exec
const path = require('path')



const fetchBlogsType = async (params) => {
    const log = logger.start(`blogsType:services:fetchBlogsType`)
    const data= await db.blogs.find({}).sort({name: 1});
    log.end();
    return data;
}

const fetchblogdetail = async (params) => {
    const data= await db.blogs.findOne({slug: params.blogid}).sort({name: 1});
    return data;
}

exports.fetchBlogsType=fetchBlogsType
exports.fetchblogdetail=fetchblogdetail