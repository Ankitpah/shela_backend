/**
Chats/Messages model
CreatedBy - Simran
Date- 10 Jan 2019
**/

'use strict'
const autoIncrement = require('mongoose-sequence')(mongoose);


const messages = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: "chatRooms" },
    message: { type: String },
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: "files" }, //Only images can be entered
    isDeleted: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Number },
    messageId: { type: Number, default: 1 } //Auto incremented number
})


messages.plugin(autoIncrement, { inc_field: 'messageId' });
module.exports = messages