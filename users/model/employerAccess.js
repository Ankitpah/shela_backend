'use strict'

const employerAccess = new mongoose.Schema({
    employee_id: { type: String },
    view_type : { type: String },
    employer_id : { type: String },
    credit_amount : { type: String }
})

module.exports = employerAccess




