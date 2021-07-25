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
    // console.log('HELLO___________',params);
    // const imgurl = params.imgurl
    
//    const log = logger.start(`blogsType:services:fetchblogdetail`)
    const data= await db.blogs.findOne({_id: params.blogid}).sort({name: 1});
    // console.log('imgurl\====>',data.imgurl)
    // if(!data.imgurl || data.imgurl == null || data.imgurl == undefined || data.imgurl == '' ){
    // console.log('imgurl\====><<<<')
        // data.imgurl = '../../../assets/images/banner/banner1.jpg'
    // }
    // console.log('data######==>>',data);
    // log.end();
    return data;
}

exports.fetchBlogsType=fetchBlogsType
exports.fetchblogdetail=fetchblogdetail