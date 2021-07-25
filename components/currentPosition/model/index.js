'use strict'


const currentPosition = new mongoose.Schema({

    addedAt: { type: Number },
    name: { type: String },
    type: { type: String },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" }




})


module.exports = currentPosition