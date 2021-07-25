'use strict'

// userId :params.userInfo._id,
//         balance_transaction:params.balance_transaction,
//         currency:params.currency,
//         customer:params.userInfo.stripeCustomerId,
//         StripePaymentId:params.id,
//         description : description,
//         totalAmount:params.amount,
//         paymentDetails:params.payment_method,
//         // metaData : params,
//         createdAt :moment().unix()
const invocies = new mongoose.Schema({

    userId: { type: String },
    balanceTransaction: { type: String },
    currency: { type: String },
    customer: { type: String },
    StripePaymentId: { type: String },
    description: { type: String },
    paymentDetails: { type: String },
    metaData: { type: Object },
    createdAt: { type: Number }



})


module.exports = invocies