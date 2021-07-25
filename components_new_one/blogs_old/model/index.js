'use strict'
const blogsType = new mongoose.Schema({
    addedAt: { type: Number },
    name: { type: String },
    type: { type: String }
})
module.exports = blogsType