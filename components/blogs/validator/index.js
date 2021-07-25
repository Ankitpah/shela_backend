'use strict'
const Joi = require('joi')
module.exports = {
    // addBlogdetail: {
    //     payload: {
    //         blogid: Joi.string().required().description("blog post Id")
    //     }
    // },
    fetchblogdetail: {
        payload: {
            blogid: Joi.string().required().description("blog post Id")
        }
    }


}