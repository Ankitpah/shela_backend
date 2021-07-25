'use strict'
const Joi = require('joi')

module.exports = {
    fetchNotifications: {
        query: {
            skip: Joi.number().default(0),
            limit: Joi.number().default(10)
        }
    },

    testNotification:{
        payload:{
            //data:Joi.string().description("the message or data to be included in the notification"),
            deviceToken: Joi.string().description("device token"),
            pushMessage:Joi.string().description("push message"),
            //receiverId:Joi.string()
            //deviceType: Joi.string().optional().allow("").description("device type"),
            // notificationMsg: Joi.string().description("notification msg"),
            // notificationData:Joi.string().description("notification data"),
            // notificationType: Joi.string().description("notification type")
        }
    }


    ,
    deleteNotification: {
        payload: {
            notificationId: Joi.string().required()
        }
    },
    header: Joi.object({
        'x-logintoken': Joi.string().required().trim().description('Provide token to access api')
    }).unknown()
}