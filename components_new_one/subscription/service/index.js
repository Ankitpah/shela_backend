'use strict'
//const config = require('../../config/default.js');
//const config = require('config').get('stripe')
const stripe = require("stripe")("sk_test_QE4jFyyXCixuwR6q7jYZplRb")
const stripeService = require('../../payments/service')
const usersService = require('../../users/service')
let count = 0;

const subscribe = async (params) => {
    try {       
        const info = await stripeService.createSubscription(params);
        info.userInfo = params.userInfo;
        if(info.amount_refunded == 0 && info.paid == true && info.failure_code == null && info.captured == true){
            const invoice = await saveInvoice(info);
            info.invoice = invoice;
            const data = await db.users.findOneAndUpdate({ _id: params.userInfo._id }, { subscriptionStatus: 1 ,
                 totalCredits: params.userInfo.availableCredits + info.credits,
                 availableCredits: params.userInfo.availableCredits+ info.credits,
                 usedCredits:0,
                 lastInvoiced:info.invoice.createdAt
                }, { new: true } );
            const paymentSuccess = {
            "isSuccess":true,
            "status": "success",
            "statusCode": 200,
            "message": "Payment done Successfully!"
        }
        return paymentSuccess
    }   
    } catch (err) {
        throw err
    }
}

const createPlan = async (params) => {
    try {
        const info = await stripeService.createPlans(params)
        return 'create plan working'
    } catch (err) {
        throw err
    }
}
const getPlans = async (params) => {
    try {

        if( params.userInfo.userRole == "employer"){
            const plans = await db.plans.find({ isEmployer : true},{ planName : 1 ,_id : 1 });

            return plans;
        }
        if( params.userInfo.userRole == "employee"){
            const plans = await db.plans.find({ isEmployer : false},{ planName : 1 ,_id : 1 });

            return plans;
        }
    } catch (err) {

        throw err;
    }
}


const saveInvoice = async (params) => {

    const invoiceRes = params;
    const totalAmount = (invoiceRes.amount) / 100;

   const description = moment().format("MMMM") + " month invoice"
   const obj = {
        userId :invoiceRes.userInfo._id,
        credits:invoiceRes.credits,
        balanceTransaction:invoiceRes.balance_transaction,
        currency:invoiceRes.currency,
        invoiceUrl:invoiceRes.receipt_url,
        customer:invoiceRes.userInfo.stripeCustomerId,
        StripePaymentId:invoiceRes.id,
        description : description,
        totalAmount:totalAmount,
        paymentDetails:invoiceRes.payment_method,
        metaData : params,
        createdAt :moment().unix()
    }
   let invoice =  await db.invoices(obj).save();
   return invoice;

}










exports.createPlan = createPlan
exports.subscribe = subscribe
exports.getPlans = getPlans