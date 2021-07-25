'use strict'

const employersContactLead = new mongoose.Schema({
    name: { type: String },
    email : { type: String },
    reachOutTimeDate : { type: String },
    message : { type: String },
    contactNumber: { type: Number },
    role:{ type: String},
    submitedAt: { type: Number }
})



module.exports = employersContactLead