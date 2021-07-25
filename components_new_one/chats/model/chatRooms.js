/**
ChatRoom model
CreatedBy - Simran
Date- 10 Jan 2019
**/


'use strict'

const chatRooms = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    createdAt: { type: Number },
    isChatInitiated:{type: Boolean, default:false},
    isChatTerminated:{type: Boolean, default:true}
})



module.exports = chatRooms