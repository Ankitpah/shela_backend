/* Sevices */
//var Certificate=require('../../../Certificates/GoogleService-Info.plist')

var FCM = require('fcm-node');
let serverKey = //'AIzaSyBCdD0q9_2_whmNOjOpnDwHLUPFvvi1arM'
    //' AIzaSyDDVyH5FAArMLZDv_0Qzl6DZJTk0Cv2bEI'
    // 'AAAAAgDOoac:APA91bGYLQhc2GO6S_cq0Hfa-VP6NMOB5dUbRqgzQZOeONsKGMaNt3FB_9sbgvhQlUKX4-DicNhxRHmnRh4lCXzcxSLimrHoEK2n5xP0lbloTcy8UBBB05nNN95ZPESLIVa9eGvmJNv8';
    'AAAAE7psf7g:APA91bFCI8iQ53km00kdmM6gY_Hx6tE_OACg27i11GXthjpT03PqSNJGXaaiaY6M0rpOdvI3B16dZ8Itxc_zD51QX4sXxbDFG1Q3YXkwMJtyzk3y_GW1zfvHShYTR_bRVkqXY8NWzX3F';
let fcm = new FCM(serverKey);




var ioS;

const settingIo = function(io) { //to access the io object here in the notificationService
    ioS = io;
}

const sendWebNotification = async (params, saveInDb) => {
    logger.start(`notifications:services:sendWebNotification`)
    params.createdAt = moment().unix()

    if (!params.senderId._id) {
        params.senderId = await db.users.findOne({ _id: params.senderId })
    }
    if (!params.receiverId._id) {
        params.receiverId = await db.users.findOne({ _id: params.receiverId })
    }
    if (params.bookingId && !params.bookingId._id) {
        params.bookingId = await db.bookings.findOne({ _id: params.bookingId })
    }
    //get total unread notifications count
    params.unReadCount = await db.notifications.count({ receiverId: params.receiverId._id, isRead: false })


    params.senderId.firstName = params.senderId.firstName.charAt(0).toUpperCase() + params.senderId.firstName.slice(1)
    let timeZone, time
    if (saveInDb) {
        timeZone = params.receiverId.deviceDetails && params.receiverId.deviceDetails.timeZone ? params.receiverId.deviceDetails.timeZone : "Asia/Kolkata"
        time = moment(params.bookingId.bookedAt.slotStartDate * 1000).tz(timeZone).format('LLLL')
    }

    if (params.notificationType == 1) { //new booking
        params.message = `You have a new booking from ${params.senderId.firstName} for ${time}`
    }
    if (params.notificationType == 2) { //cancel booking
        params.message = `${params.senderId.firstName} has cancelled a booking scheduled for ${time}`
    }
    if (params.notificationType == 3) { //Re-schedule booking
        params.message = `${params.senderId.firstName} has made changes in the booking scheduled at ${time}`
    }
    if (params.notificationType == 4) { //chat message
        params.message = `${params.senderId.firstName} has sent you a message`
    }
    if (saveInDb) {
        await db.notifications(params).save();
    }

    if (params.receiverId.deviceDetails && params.receiverId.deviceDetails.socketId) {
        const final = {
            senderId: { _id: params.senderId._id, firstName: params.senderId.firstName, profilePicId: params.senderId.profilePicId || "" },
            receiverId: params.receiverId._id,
            bookingId: params.bookingId && params.bookingId._id ? params.bookingId._id : "",
            notificationType: params.notificationType,
            message: params.message,
            createdAt: params.createdAt
        }

        ioS.to(params.receiverId.deviceDetails.socketId).emit("notification", {
            data: final
        });

    }
    return true;

}

const fetchNotifications = async (params) => {

    const data = await db.notifications.find({ receiverId: params.userInfo._id, isDeleted: false }, { isRead: 0, isDeleted: 0, receiverId: 0, bookingId: 0, __v: 0 }, { sort: { createdAt: -1 }, skip: params.skip, limit: params.limit })
        .populate({ path: "senderId", select: "fullName profilePicId" })

    data.totalRecords = await db.notifications.count({ receiverId: params.userInfo._id, isDeleted: false })

    await db.notifications.update({ receiverId: params.userInfo._id }, { isRead: true }, { multi: true })

    return data;
}

const deleteNotification = async (params) => {
    await db.notifications.findOneAndUpdate({ _id: params.notificationId }, { isDeleted: true }, { new: true })

    return "Deleted successfully"
}


const sendFCM = async (payload) => {
    var message = {
        to: payload.deviceToken, // required fill with device token or topics
        // Authorization: key = serverKey,
        data: payload,
        notification: {
            title: 'Shela',
            body: payload.notificationMsg
        }
    };
    fcm.send(message, function(err, response) //.then(function(response) {
        {
           
            if (err) {
                throw err
            } else {
            }
        })
}



/**
...............................................
Send Single Notification
...............................................
Format of payload =>{
sender :{ senderId , role:'employer/ employee'},
receiver :{receiverId ,role:'employee'},
message:
type:
}**/
const sendPushNotification = async (payload, saveInDb) => {
    //fetch device token of candidate.

    let users = await db.users.findOne({ _id: payload.reciverId});
    if (users) {

        // notification type actions

    let notificationData = {
        deviceToken: users.fcmToken,           // changed from token to access token, receive token from frontend
        //deviceType: candidateData.device.type,
        notificationMsg: payload.pushMessage,                  // notification message is the text or data
        createdAt: moment().unix(),
        senderId: payload.userInfo._id,
        senderFirstName:payload.userInfo.firstName || payload.userInfo.fullName,
        // senderLastName:payload.userInfo.lastName,
        receiverId:payload.reciverId,
        receiverFirstName: users.firstName || users.fullName,
        // receiverLastName: users.lastName,         
        notificationType: payload.type
    }

    var saveDb = await db.notifications(notificationData).save()
        
    }
};

const testNotification = async (params) => {
    const data = await sendPushNotification(params)
    return "test Notification working";
}

exports.sendPushNotification = sendPushNotification
exports.testNotification = testNotification
exports.sendWebNotification = sendWebNotification

exports.settingIo = settingIo
//exports.sendNotification = sendNotification
exports.fetchNotifications = fetchNotifications
exports.deleteNotification = deleteNotification