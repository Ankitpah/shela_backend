/* Notifications model
Simran
16 Jan 2019
*/

const notifications = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    message: { type: String },
    notificationMsg: { type: String },
    deviceToken: { type: String },
    createdAt: { type: Number },
    isRead: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    saveInDb: { type: Boolean, default: true },
    notificationType: { type: Number } //1-New booking, 2-  , 3-  , 4-chat messages
})

module.exports = notifications