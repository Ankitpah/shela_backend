'use strict'

const contactus = new mongoose.Schema({
    jobTitle: { type: String },

    fullName : { type: String },
    email : { type: String },
    contactNumber : { type: Number },
    message : { type: String },
    createdAt: { type: Number }
})



module.exports = contactus