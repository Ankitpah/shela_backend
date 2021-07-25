/* Notifications model
aashish
20 feb 2019
*/
const AutoIncrement = require('mongoose-sequence');

const invoices = new mongoose.Schema({
    // invoiceId: { type: String, default:'0' },
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    // invoiceUrl: { type: String }, // url from stripe
    // description: { type: String },
    metaData: { type: Object },
    // createdAt: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    balanceTransaction: { type: String },
    invoiceUrl: { type: String },
    currency: { type: String },
    customer: { type: String },
    totalAmount:{ type: Number },
    StripePaymentId: { type: String },
    description: { type: String },
    paymentDetails: { type: String },
    metaData: { type: Object },
    credits: { type: Number},
    createdAt: { type: Number }
    
})
//invoices.plugin(AutoIncrement, { inc_field: 'invoice_id' });
module.exports = invoices