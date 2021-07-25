'use strict'
const Joi = require('joi')

module.exports ={

    addJobType:{
        payload:{
            name:Joi.string().trim().description("the name of the jobType")
        }
    },
    // searchJobType:{
    //     query:{
    //         name:Joi.string().trim().description("enter the JobType to search")
    //     }
    // },

    accessDenied: Joi.object({
        isSuccess: Joi.boolean().default(false),
        status: Joi.string(),
        statusCode: Joi.number().default(400),
        message: Joi.string()
    }),
    failure: Joi.object({
        isSuccess: Joi.boolean().default(false),
        status: Joi.string(),
        statusCode: Joi.number().default(320),
        message: Joi.string()
    }),
    success: Joi.object({
        isSuccess: Joi.boolean().default(true),
        status: Joi.string(),
        statusCode: Joi.number().default(200),
        message: Joi.string()
    }),
    header: Joi.object({
        'x-logintoken': Joi.string().required().trim().description('Provide token to access api')
    }).unknown()


}