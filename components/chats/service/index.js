/** Chat Service **/
const fs = require('fs')
const exec = require('child_process').exec
const path = require('path')

const fileService = require("../../files/service")
const notifications = require('../../notifications/service')

var ioS;

const setIo = function (io) { //to access the io object here in the chatService
    ioS = io;
}

const sendMessage = async (params) => {
    params.createdAt = moment().unix()
    const data = await db.chatRooms.findOne({
        $and: [{
            $or: [{ senderId: params.senderId }, { senderId: params.receiverId }]
        },
        { $or: [{ receiverId: params.senderId }, { receiverId: params.receiverId }] }
        ]
    });

    const senderRole = await db.users.findOne({ _id: params.senderId }).lean()

    const receiverRole = await db.users.findOne({ _id: params.receiverId }).lean()

    //If chatting for first time create room and only the employer can initiate the chats
    // Also the employer can terminate the chat at any given time
    if (senderRole.userRole !== receiverRole.userRole) {
        if (data == null && senderRole.userRole == "employer") {
            const roomData = await db.chatRooms({ senderId: params.senderId, receiverId: params.receiverId, isChatInitiated: true, isChatTerminated: false }).save();
            await db.users.findOneAndUpdate({ _id: params.senderId }, { "graphData.messagingContactsMade": 1 })
            params.chatRoomId = roomData._id;
        }
        else if (data != null && /* data.isChatTerminated==false  &&*/ senderRole.userRole == "employer") {
            params.chatRoomId = data._id
        } else if (data != null && data.isChatTerminated == false && senderRole.userRole == "employee" && data.isChatInitiated == true) {
            params.chatRoomId = data._id // if the employer has terminated chat, employee can not msg him
        } else if (data != null && data.isChatTerminated == true && senderRole.userRole == "employer") {
            params.chatRoomId = "" // if the employer has terminated the chat he has to reinitiate the chat then only he can msg employee
        } else {
            params.chatRoomId = ""
        }
        if (params.chatRoomId != "") {
            const message = await db.chats(params).save();

            //sending notification===========start========================

            const payload = {
                userInfo: senderRole,
                pushMessage: "New message received.",
                reciverId: receiverRole._id,
                type: 6
            }

            const notify = await notifications.sendPushNotification(payload)

            //sending notification===========end========================
            return message;
        } else {
            return "Message sending failed"
        }
    } else {
        return "user Roles must be different"
    }

}

const getUnReadCount = async (params) => {
    const data = await db.chats.count({ chatRoomId: params.chatRoomId, receiverId: params.receiverId, isRead: false, isDeleted: false })
    return data;
}

const checkReceiver = async (params) => {
    const data = await db.users.findOne({ _id: params.receiverId })
    return data;
}

const checkSender = async (params) => {
    const data = await db.users.findOne({ _id: params.senderId })
    return data;
}

const fetchMessages = async (params) => {
    const criteria = {
        $and: [{
            $or: [{ senderId: params.senderId }, { senderId: params.receiverId }]
        },
        { $or: [{ receiverId: params.senderId }, { receiverId: params.receiverId }] }
        ],
        isDeleted: false
    }

    const allMessages = {}

    // allMessages.totalCount = await db.chats.count(criteria)

    allMessages.data = await db.chats.find(criteria, { senderId: 1, receiverId: 1, message: 1, fileId: 1, createdAt: 1 }, { skip: params.skip || 0, limit: params.limit || 10 }).sort({createdAt: 1})
        .populate({ path: "senderId", select: "firstName lastName profilePic" })
        .populate({ path: "receiverId", select: "firstName lastName profilePic" })

    //Done so that respective sender and receiver can be shown at frontend on LHS & RHS
    for (var i = 0; i < allMessages.length; i++) {
        if (allMessages[i].receiverId.toString() == params.senderId.toString()) //senderId is user accessing messages
        {
            allMessages[i].senderId = params.senderId
            allMessages[i].receiverId = allMessages[i].senderId
        }
    }


    allMessages.totalCount = await db.chats.count(criteria)

    logger.start("Mark messages read that are sent to me")
    await db.chats.update({ senderId: params.receiverId, receiverId: params.senderId }, { isRead: true }, { multi: true, new: true });

    //sending notification===========start========================
    const senderDetails = await db.users.findOne({ _id: params.senderId }).lean();
    // const payload = {
    //     userInfo: senderDetails,
    //     pushMessage: "New message recieved.",
    //     reciverId: params.receiverId,
    //     type: 6
    // }

    // const notify = await notifications.sendPushNotification(payload)

    //sending notification===========end========================

    return allMessages
}

const fetchInbox = async (params) => {
    let finalData = [],
        obj = {}

    let criteria = { $or: [{ senderId: params.senderId }, { receiverId: params.senderId }] }
    if (params.searchByName && params.searchByName != "") {
        const searchData = await db.users.find({ fullName: new RegExp(params.searchByName, "i") }, { _id: 1 });
        let array = [];
        searchData.forEach(element => {
            array.push(element._id);
        });
        criteria = {
            $or: [
                { $and: [{ senderId: params.senderId }, { receiverId: { $in: searchData } }] },
                { $and: [{ senderId: { $in: searchData } }, { receiverId: params.senderId }] }]
        }
    }
    const allRooms = await db.chatRooms.find(criteria, {}, { skip: params.skip || 0, limit: params.limit || 10 })
    const inboxLength = await db.chatRooms.count(criteria)
    for (const item in allRooms) {
        
        let messages = await db.chats.findOne({ chatRoomId: allRooms[item]._id, isDeleted: false }, { isDeleted: 0, isRead: 0, chatRoomId: 0, __v: 0 }, { sort: { messageId: -1 }, limit: 1 })
            .populate({ path: "senderId", select: "fullName profilePicId companyLogo" })
            .populate({ path: "receiverId", select: "fullName profilePicId companyLogo" })

        if (messages.receiverId !== null && messages.receiverId.toString() == params.senderId.toString()) { //senderId is user accessing messages
            messages.senderId = params.senderId
            messages.receiverId = messages.senderId
        }
        if (messages.receiverId !== null){
            let unReadCount = await db.chats.count({ chatRoomId: allRooms[item]._id, isDeleted: false, isRead: false, receiverId: params.senderId })
            finalData.push({ totalUnReadMessage: unReadCount, data: messages })
        }
    }
    obj.inboxLength = inboxLength;
    obj.messages = finalData;
    return obj;
}

const uploadAttachment = async (params) => {
    params.type = 8;
    params.ext = await fileService.checkExtension(params)

    const folderPath = path.join(__dirname, "../../../assets/images/cdn/" + params.payload.userId._id);

    const receiverInfo = await checkReceiver(params.payload)

    const obj = {
        userId: params.payload.userId._id,
        tmpLocation: folderPath,
        fileOriginalName: params.payload.file.hapi.filename,
        fileType: params.payload.file.hapi.headers["content-type"],
        fileExtension: params.ext,
        type: 8,
        uploadedAt: moment().unix(),
        tmpFile: false
    }

    params.fileDetails = await db.files(obj).save()

    await fileService.createTempFolder(folderPath)
    params.path = folderPath
    await fileService.writeFile(params)

    params.senderId = params.payload.userId._id
    params.fileId = params.fileDetails._id
    params.receiverId = params.payload.receiverId

    const chatMessage = await sendMessage(params)

    params.chatRoomId = chatMessage.chatRoomId
    const count = await getUnReadCount(params)

    const dataToEmit = {
        senderId: {
            _id: params.payload.userId._id,
            firstName: params.payload.userId.firstName,
            lastName: params.payload.userId.lastName ? params.payload.userId.lastName : ""
        },
        receiverId: {
            _id: receiverInfo._id,
            firstName: receiverInfo.firstName,
            lastName: receiverInfo.lastName ? receiverInfo.lastName : ""
        },
        fileId: params.fileDetails._id,
        message: "",
        createdAt: chatMessage.createdAt,
        _id: chatMessage._id,
        chatRoomId: chatMessage.chatRoomId,
        unReadCount: count
    }

    if (receiverInfo.deviceDetails) {
        if (receiverInfo.deviceDetails.socketId) {
            ioS.to(receiverInfo.deviceDetails.socketId).emit("receiveMessageEvent", {
                data: dataToEmit
            });
        } else {
            //Send Notification to user
        }
    }
    
    //sending notification===========start========================
    const senderDetails = await db.users.findOne({ _id: dataToEmit.senderId._id }).lean();
    const payload = {
        userInfo: senderDetails,
        pushMessage: "You have recieved new file.",
        reciverId: dataToEmit.receiverId._id,
        type: 6
    }

    const notify = await notifications.sendPushNotification(payload)

    //sending notification===========end========================

    return params.fileDetails._id
}

const terminateChatRoom = async (params) => {
    // const data = await db.users.findOne({ _id: params.receiverId },{})
    var obj = {
        isChatTerminated: true
    }

    const data = await db.chatRooms.findOneAndUpdate({ senderId: params.senderId, receiverId: params.receiverId }, obj);

    return data;
}

const restartChatRoom = async (params) => {
    // const data = await db.users.findOne({ _id: params.receiverId },{})
    var obj = {
        isChatTerminated: false
    }

    const data = await db.chatRooms.findOneAndUpdate({ senderId: params.senderId, receiverId: params.receiverId }, obj);

    return data;
}







exports.setIo = setIo
exports.sendMessage = sendMessage
exports.getUnReadCount = getUnReadCount
exports.checkSender = checkSender
exports.fetchMessages = fetchMessages
exports.fetchInbox = fetchInbox
exports.uploadAttachment = uploadAttachment
exports.checkReceiver = checkReceiver
exports.terminateChatRoom = terminateChatRoom
exports.restartChatRoom = restartChatRoom