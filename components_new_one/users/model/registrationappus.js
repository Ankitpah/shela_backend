'use strict'

const registrationappus = new mongoose.Schema({
    jobTitle: { type: String },

    fullName : { type: String },
    email : { type: String },
    contactNumber : { type: Number },
    createdAt: { type: Number }
})



module.exports = registrationappus