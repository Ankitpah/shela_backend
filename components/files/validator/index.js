'use strict'
const Joi = require('joi')

module.exports = {

    uploadFile: {
        payload: {
            type: Joi.string().valid(['1', '2', '3', '4', '5', '6']).required().description('Type of Document'),
            file: Joi.any().meta({
                swaggerType: 'file'
            }).required().description('File of any extension')
        },
        formPayload: {
            maxBytes: 314572800,//3145728,
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
        }
    },
    fetchFile: {
        query: {
            // fileId: Joi.string().required()
            fileId: Joi.string().optional().allow(""),
            type: Joi.string().optional().allow("")
        }
    },
    deleteFile: {
        payload: {
            fileId: Joi.string().required(),
            type: Joi.number().required().valid(["2", '3', '4', '5', '6', '7'])
        }
    },
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