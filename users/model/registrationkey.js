'use strict'

const registrationkey = new mongoose.Schema({
    key: { type: String },
    "isAssigned":  { type: Boolean },
})



module.exports = registrationkey