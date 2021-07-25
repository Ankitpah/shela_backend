/* subscription model*/

const subscription = new mongoose.Schema({

    subscribedAt:{type: Number},
    subscriptionStatus:{type: Number, default:0},
    transactionDetails: { type: String },
    status: { type: String }








    // patientId: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, //patient
    // doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, //doctor
    // bookedAt: {
    //     slotStartDate: { type: Number }, //full date
    //     slotEndDate: { type: Number },
    //     day: { type: String }, // day in string
    //     dayNumber: { type: Number }, // only day number
    //     slotsBooked: [{
    //         startTime: { type: Number }, //only time in seconds
    //         endTime: { type: Number }
    //     }]
    // },
    // bookedFor: { type: String }, //relation booking done for.
    // createdAt: { type: Number },
    // status: { type: String }, //bookingDone,cancelled,completed,expired(when call was not connected and time expired)
    // consultationFee: { type: Number },
    // totalSlotsBooked: { type: Number },
    // totalAmount: { type: Number },
    // transactionDetails: { type: String },
    // cancellationDetails: {
    //     cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    //     cancellationReason: { type: String },
    //     cancellationMessage: { type: String },
    //     cancelledAt: { type: Number }
    // },
    // actualCallDuration: { type: Number },
    // rating: { type: Number, default: 0 },
    // review: { type: String },
    // ratedOn: { type: Number },
    //  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "invoices" }
})








module.exports = subscription