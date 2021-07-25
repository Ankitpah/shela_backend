'use strict'
const Joi = require('joi')

module.exports = {

    subscribe:{
        payload:{
            subscribedAt:Joi.number().optional().allow("").description("time of subscription"),
            //cardId:Joi.string().optional().allow(""),
            cardToken: Joi.string().optional().allow(""),       //.default("card_1DpskJDzsYlNh55pjijxX2ei"),
        //totalAmount:Joi.number().optional(),
            makePayment: Joi.boolean().default(false).optional(),
            planName:Joi.string().optional().description("the name of the plan the user is subscribing to "),
            planId:Joi.string().required()
        }
    },
    
    // createPlan

    createPlan:{
        payload:{
            planCreatedAt:Joi.number().optional().allow("").description("time of subscription"),
            //planId:Joi.string().optional().allow(""),
            planName: Joi.string().optional().allow(""),    
            amount:Joi.number().optional(),
            interval:Joi.string().optional().description("the interval of plan, like day month, year etc"),
            intervalCount:Joi.number().optional().description("the interval count in number, positive integer"),
            //nickname: Joi.string().optional().allow(""),
            productName: Joi.string().optional().allow(""),
            currency:Joi.string().optional().allow("").default("gbp"),

            trialPeriodDays:Joi.number().description("the no of days given for trial"),
            planBenefits:Joi.number().optional().description("the benefits of the plan or statement descriptor"),
            //makePayment: Joi.boolean().default(false)
            freeMsgCount:Joi.number().description(" free msgs available for the plan"),
            freePvaCount:Joi.number().description("free pva count available for the pva's")


        }
    }
   
    ,
    header: Joi.object({
        'x-logintoken': Joi.string().required().trim().description('Provide token to access api')
    }).unknown()
}







 // createBooking: {
    //     payload: {
    //         doctorId: Joi.string().required(),
    //         bookedFor: Joi.string().lowercase().required(),
    //         bookedAt: Joi.object().keys({
    //             date: Joi.number().required(), //full date
    //             day: Joi.string().required(), // day in string
    //             dayNumber: Joi.number().required(), // only day number
    //             slotsBooked: Joi.array().items(Joi.object().keys({
    //                 startTime: Joi.number().required(),
    //                 endTime: Joi.number().required()
    //             })),
    //         }).required(),
    //         totalAmount: Joi.number().required(),
    //         consultationFee: Joi.number().required(),
    //         cardId: Joi.string().optional().allow("").default("card_1DpskJDzsYlNh55pjijxX2ei"),
    //         cardToken: Joi.string().optional().allow(""),
    //         makePayment: Joi.boolean().default(false)
    //     }
    // },
    // reScheduleBooking: {
    //     payload: {
    //         bookingId: Joi.string().required(),
    //         bookedFor: Joi.string().required(),
    //         bookedAt: Joi.object().keys({
    //             date: Joi.number().required(), //full date
    //             day: Joi.string().required(), // day in string
    //             dayNumber: Joi.number().required(), // only day number
    //             slotsBooked: Joi.array().items(Joi.object().keys({
    //                 startTime: Joi.number().required(),
    //                 endTime: Joi.number().required()
    //             })),
    //         }).required(),
    //         totalAmount: Joi.number().required(),
    //         consultationFee: Joi.number().required(),
    //         cardId: Joi.string().optional().allow("").default("card_1DpskJDzsYlNh55pjijxX2ei"),
    //         cardToken: Joi.string().optional().allow(""),
    //         makePayment: Joi.boolean().default(false)
    //     }
    // },
    // cancelBooking: {
    //     payload: {
    //         bookingId: Joi.string().required(),
    //         cancellationReason: Joi.string().required(),
    //         cancellationMessage: Joi.string().required(),
    //         makePayment: Joi.boolean().default(false)
    //     }
    // },
    // fetchBookings: {
    //     query: {
    //         status: Joi.string().required().valid(["upcoming", "past", "cancelled"]),
    //         skip: Joi.number().required().default(0),
    //         limit: Joi.number().required().default(10)
    //     }
    // },
    // fetchTodaysBookings: {
    //     query: {
    //         currentDate: Joi.number().required(),
    //         skip: Joi.number().required().default(0),
    //         limit: Joi.number().required().default(10)
    //     }
    // },
    // reviewAndRating: {
    //     payload: {
    //         bookingId: Joi.string().required(),
    //         rating: Joi.number().required(),
    //         review: Joi.string().required()
    //     }
    // },
    // fetchDetailsOfBooking: {
    //     query: {
    //         bookingId: Joi.string().required()
    //     }
    // }