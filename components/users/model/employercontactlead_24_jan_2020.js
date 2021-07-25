'use strict'

const employersContactLead = new mongoose.Schema({
    name: { type: String },
    email : { type: String },
    reachOutTimeDate : { type: String },
    message : { type: String },
    submitedAt: { type: Number },
    Empname : {type: String},
    Empemail : {type: String},
    tellus : {type: String},
    description : {type: String},
    type : {type: String},
    contactNumber1 : {type: Number},
    contactnumber : {type: Number},
})



module.exports = employersContactLead