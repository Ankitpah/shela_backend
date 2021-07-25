'use strict'

const files = new mongoose.Schema({
    uploadedAt: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    tmpFile: { type: Boolean, default: true },
    tmpLocation: { type: String },
    fileOriginalName: { type: String },
    fileType: { type: String },
    fileExtension: { type: String },
    type: { type: Number }, // 1 - profile pic , 2- correspondance, 3- family relations , 4- family correspondance,5-identity,6-signature,7-documents
    isDeleted: { type: Boolean, default: false },
    thumbnail: { type: String } //base 64 string
})



module.exports = files