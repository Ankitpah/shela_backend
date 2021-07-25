'use strict'


const serviceType = new mongoose.Schema({

    addedAt: { type: Number },
    name: { type: String },
    type: { type: String }



})

module.exports = serviceType