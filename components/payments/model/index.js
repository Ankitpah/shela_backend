/* payments using stripe model
author : Simran
date : 3 Jan 2019
*/

const payments = new mongoose.Schema({
    // bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "bookings" },
    // patientId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    // doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    stripeCustomerId: { type: Number },
    createdAt: { type: Number },
    // transactionType: { type: String, enum: ["cardToStripe", "stripeToBank", "refund"] },
    transactionStatus: { type: String },
    totalAmountCharged: { type: Number },
    totalAmountToTransfer: { type: Number }, //transfer to 
    cardID: { type: String },
    chargeID: { type: String },
    transactionID: { type: String },
    metaData: { type: Object },
    currency: { type: String },
    livemode: { type: String }
})

module.exports = payments