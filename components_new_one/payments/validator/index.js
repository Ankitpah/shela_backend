'use strict'
const Joi = require('joi')

module.exports = {
    addCard: {
        payload: {
            cardToken: Joi.string().required()
        }
    },
    isPaid: {
        payload: {
            cardToken: Joi.string().required()
        }
    }
     ,
     createSubscription:{
         payload:{

         }
     },
     retreiveWebhook:{
         payload:{

         }
     }
     ,
     fetchPlans:{
         payload:{
             
         }
     },
     editPlans:{
         payload:{
            planCreatedAt:Joi.number().optional().allow("").description("time of subscription"),
           
            planName: Joi.string().optional().allow(""),    
            totalAmount:Joi.number().optional(),
            interval:Joi.string().optional().description("the interval of plan, like day month, year etc"),
            intervalCount:Joi.number().optional().description("the interval count in number, positive integer"),
            //nickname: Joi.string().optional().allow(""),
            productName: Joi.string().optional().allow(""),
            currency:Joi.string().optional().allow("").default("gbp"),
            planId:Joi.string().trim().description("the plan Id of the plan"),
            trialPeriodDays:Joi.number().description("the no of days given for trial"),
            planBenefits:Joi.number().optional().description("the benefits of the plan or statement descriptor")
            //makePayment: Joi.boolean().default(false)
         }
     },
     deletePlan:{
         payload:{
             
         }
     }
     ,

     webhooks:{
        payload:{
            // updated
            created:Joi.number().description("create timestamp"),
            id:Joi.string().trim().description("id"),
            type:Joi.string().optional().description("type such as good or service"),
            
           
            api_version:Joi.string().description("the api version"),
           
             pending_webhooks:Joi.number().description("pending webhooks"),
             data:Joi.object().keys({}).allow("").optional().description("the object name"),
                
                    id: Joi.string().description("id"),
                   // object: Joi.string().description("the object"),
                   
                    
                    amount: Joi.number().description("amount"),
                    billing_scheme: Joi.string().description("the description"),
                    created: Joi.number().description("created"),
                    currency: Joi.string().description("currency"),
                    interval: Joi.string().description("interval"),
                    interval_count:Joi.number().description("interval_count"),

                   
                    nickname: Joi.string().description("nickname"),
                    product: Joi.string().description("product"),
                    transform_usage: Joi.string().description("transform_usage"),
                    trial_period_days: Joi.string().description("trial_period_days"),
                    usage_type: Joi.string().description("usage_type"),
                    tiers:Joi.string().description("tiers"),
                    
                     tiers_mode:Joi.string().description("tiers_mode"),



                   // livemode:Joi.string().description("livemode"),
                   active: Joi.string().description("active"),
                   aggregate_usage: Joi.string(),
                   metadata: Joi.array().description("meta data array"),


                   //object:Joi.array().allow("").description("the data"),
               // }).allow("").optional().description("the object name"),
            // }).description("the data"),
           
            // livemode:Joi.string().optional().description("livemode string"),


        }
    },
    // addBankAccount: {
    //     payload: {
    //         sort: Joi.string().trim().required().label('BSB'),
    //         accountNumber: Joi.string().trim().required().label("Account number")
    //     }
    // },
    header: Joi.object({
        'x-logintoken': Joi.string().required().trim().description('Provide token to access api')
    }).unknown()
}