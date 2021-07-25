/* stroing cardDetails model
author : Simran
date : 3 Jan 2019
*/

const cardDetails = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    createdAt: { type: Number },
    metaData: { type: Object },
    isDeleted: { type: Boolean, default: false },
})

module.exports = cardDetails