'use strict'

const md5 = require('md5')

const auth = require('../../../utils/auth')
const services = require('../../job/service')
const fileService = require('../../files/service')
const jobService = require('../../job/service/index')
const notifications = require('../../notifications/service')

const getUserByEmail = async (emailId) => {
    const log = logger.start(`users:services:getUserByEmail:${emailId}`)

    const user = await db.users.findOne({
        email: emailId,
        isDeleted: false,
    })
    log.end()

    return user
}
const getRegisterkey = async (regKey) => {
    const registerKey = await db.registrationkey.findOne(
        {
            keys: regKey,
        })
    return registerKey
}

const signUp = async (params) => {
    const log = logger.start('users:service:signUp')
    if(params.userRole == "employer"){
        const oldRegkey = await getRegisterkey(params.registrationkey)
        if(oldRegkey && oldRegkey.isAssigned == true){
            log.end()
            throw new Error(`Registraion key already used.`)
        }
        if(oldRegkey == undefined || oldRegkey == null || oldRegkey == '' || !oldRegkey){
            log.end()
            throw new Error(`Please enter valid registraion key`)
        }
    }
    const oldUser = await getUserByEmail(params.email)
    var creditsDetails = {
        credits: 0,
        availcredits: 0,
        usedcredit: 0,
    }

    if (oldUser) {
        log.end()
        throw new Error('Email already registered with us.')
    }

    if(params.creditType == 0){
        creditsDetails.credits = 150
        creditsDetails.availcredits = 150
        creditsDetails.usedcredit = 0 
    }
    else if(params.creditType == 1){
        creditsDetails.credits = 200
        creditsDetails.availcredits = 200
        creditsDetails.usedcredit = 0
    }

    const userModel = {

        userRole: params.userRole,
        fullName: params.fullName,
        email: params.email,
        registraionKey:params.registrationkey,
        password: md5(params.password),
        userRegisterationTime: moment().unix(),
        totalCredits: creditsDetails.credits,
        availableCredits: creditsDetails.availcredits,
        usedCredits: creditsDetails.usedcredit
    }


    const user = await new db.users(userModel)

    user.emailVerifyToken = auth.randomToken(user.id)
    var x = await user.save();
    const obj = {isAssigned:true}
    const data = await db.registrationkey.findOneAndUpdate({keys: params.registrationkey},obj)
    offline.queue('user', 'sign-up', {
        id: user.id
    }, {})

    log.end()

    return 'Follow the link in the verification email to start with shela.'
}



//****************     social login or social signUp     *************/


const socialSignUp = async (params) => {
    const log = logger.start('users:service:socialSignUp')
    let newLogin = 0
    let data1
    let data
    const oldUser = await db.users.findOne({ email: params.email }, { loginType: 1 });
    if ((oldUser && oldUser.isDeleted)) {
        throw new Error('')
    }

    if (oldUser && oldUser.isSuspended) {
        throw new Error('Your account is suspended. To login, please contact your administrator.')
    }

    if (oldUser) {
        if (oldUser.loginType == 1) // ([2,3,4].includes(oldUser.loginType))
        {
            throw new Error(' user already exist  ')
        } else if (oldUser.loginType != params.loginType) {
            newLogin = 1
        } else if (oldUser.loginType == params.loginType && oldUser.loginType != 1) {
            newLogin = 0
        }
    } else {
        newLogin = 1
    }


    if (newLogin == 1) {
        const userModel = {
            userRole: params.userRole,
            fullName: params.fullName,
            email: params.email,
            //password: md5(params.password),
            userRegisterationTime: moment().unix(),
            loginType: params.loginType,
        }

        if (params.loginType == 2)
            userModel["facebookLoginId"] = params.socialId
        else if (params.loginType == 3)
            userModel["googleLoginId"] = params.socialId
        else if (params.loginType == 4)
            userModel["linkedInLoginId"] = params.socialId
        if(params.creditType == 0){
            userModel.totalCredits = 150
            userModel.availableCredits = 150
            userModel.usedCredits = 0 
        }
        else if(params.creditType == 1){
            userModel.totalCredits = 200
            userModel.availableCredits = 200
            userModel.usedCredits = 0 
        }

        const user = await new db.users(userModel).save();

        const obj = {
            timeStamp: moment().unix(),
            accessToken: auth.createToken(user._id),
            timeZone: params.timeZone
        }
        data1 = await db.users.findOneAndUpdate({ email: params.email }, { deviceDetails: obj }, { lean: true })
        data1.token = obj.accessToken
        data = await db.users.findOne({ email: params.email }, { email: 1, userRole: 1, "deviceDetails.accessToken": 1, fullName: 1 })
    } else if (newLogin == 0) {
        const obj = {
            timeStamp: moment().unix(),
            accessToken: auth.createToken(oldUser._id),
            timeZone: params.timeZone
        }
        data1 = await db.users.findOneAndUpdate({ email: params.email }, { deviceDetails: obj }, { lean: true })
        data1.token = obj.accessToken
        data = await db.users.findOne({ email: params.email }, { email: 1, userRole: 1, "deviceDetails.accessToken": 1, fullName: 1 })
    }

    return data
}



//****************Login*************/

const login = async (params) => {
    const log = logger.start('users:service:login')
    params.email = params.email.charAt(0).toLowerCase() + params.email.substring(1)
    const user = await getUserByEmail(params.email)
    if ((!user) || (user && user.isDeleted)) {
        throw new Error('Invalid credentials')
    }

    if (user && user.isSuspended) {
        throw new Error('Your account is suspended. To login, please contact your administrator.')
    }
    if (user && user.isblocked) {
        throw new Error('Your account is Blocked. To login, please contact your administrator.')
    }

    if (user && !user.isEmailVerified) {
        throw new Error(`Your email address ${user.email} has not been verified. Please check your inbox, then follow the instructions.`)
    }

    var isValid = await db.users.findOne({ userRole: params.userRole, email: params.email, password: md5(params.password), isDeleted: false })

    if (!isValid || isValid == null)
        throw new Error('Invalid credentials')

    const dataToUpdate = {
        deviceDetails: {
            timeStamp: moment().unix(),
            accessToken: auth.createToken(isValid._id),
            timeZone: params.timeZone
        }
    }
    if(params.fcmToken) {
        dataToUpdate.fcmToken = params.fcmToken;
    }
    const data = await db.users.findOneAndUpdate({ email: params.email }, dataToUpdate).lean();
    log.end()
    user.token = dataToUpdate.deviceDetails.accessToken;
    return user
}

const verifyEmail = async (token) => {
    const log = logger.start('users:service:verifyEmail')

    const user = await db.users.findOne({
        emailVerifyToken: token,
        isDeleted: false
    })

    if (!user) {
        throw new Error('Link expired.')
    }
    // $unset: { emailVerifyToken: 1 }
    await db.users.findOneAndUpdate({ emailVerifyToken: token, isDeleted: false }, { accountVerificationTime: moment().unix(), isEmailVerified: true })
    return user;
}

const checkEmailExists = async (params) => {

    const user = await db.users.findOne({ email: params.email, isDeleted: false })

    if (!user) throw new Error("Email not exists")

    if (user && !user.isEmailVerified) throw new Error(`Your email address has not been verified. Please check your inbox, then follow the instructions.`)

    return "Email exists"

}

const forgotPassword = async (params) => {
    const log = logger.start('users:service:forgotPassword')

    const user = await getUserByEmail(params.email)

    if (!user)
        throw new Error('This email is not registered with us.')

    if (!user.isEmailVerified)
        throw new Error(`Your email address ${user.email} has not been verified. Please check your inbox, then follow the instructions.`)

    user.resetPasswordToken = auth.randomToken(user.id)
    await user.save()

    offline.queue('user', 'forgot-password', {
        id: user.id
    }, {})

    log.end()

    return 'Please check your email to update your password.'
}

const resetPasswordToken = async (token) => {
    const log = logger.start('users:service:resetPasswordToken')

    const user = await db.users.findOne({
        resetPasswordToken: token
    })

    // if (!user) {
    //     throw new Error('Link expired.')
    // }
    log.end()
    return 'user verified to password update'
}

const verifyResetPasswordToken = async (token) => {

    const log = logger.start('users:service:verifyResetPasswordToken')

    const user = await db.users.findOne({
        resetPasswordToken: token
    })

    // if (!user) throw new Error('Link expired.')
    log.end()
    return 'Valid link'
}

const verifyResetAdminPasswordToken = async (token) => {

    const log = logger.start('users:service:verifyResetAdminPasswordToken')

    const user = await db.powerpanels.findOne({
        resetPasswordToken: token
    })
    if (user == null || user == '' || user == undefined) throw new Error('Link expired.')
    log.end()
    return 'Valid link'
}

const logout = async (params) => {
    const log = logger.start('users:service:logout')

    const data = await db.users.findOneAndUpdate({ _id: params }, { $unset: { deviceDetails: 1 } })
    log.end();
    return 'Logged out successfully.'
}

const getEmail = async (params) => {
    const log = logger.start('users:service:getEmail')

    const data = await db.users.findOne({ _id: params }, { email: 1 }, { lean: true })
    log.end()
    return data;
    // return 'getEmail successfully received'
}

const resendEmailVerificationLink = async (email) => {
    const log = logger.start('users:service:resendEmailVerificationLink')

    const user = await getUserByEmail(email)

    if (!user) throw new Error('Email not registered with Shela')
    if (user.isEmailVerified) throw new Error(`Email ${user.email} is already verified , Please login !`)

    user.emailVerifyToken = auth.randomToken(user.id)
    var x = await user.save()
    offline.queue('user', 'sign-up', {
        id: user.id
    }, {})

    log.end()

    return `A link to verify the email has been sent to ${user.email}. Please check your inbox, then follow the instructions.`
}

const changePassword = async (params) => {
    const log = logger.start('user:service:changePassword')
    var user = await db.users.findOneAndUpdate({ _id: params.userId, password: md5(params.oldPassword) }, { password: md5(params.newPassword) })
    if (!user) throw new Error("Invalid old password")
    log.end();
    return 'Password changed successfully'
}


const setNewPassword = async (params) => {
    const log = logger.start('user:service:setNewPassword')
    const user = await db.users.findOne({
        resetPasswordToken: params.resetPasswordToken
    })
    // if (!user) throw new Error('Link expired.')

    await db.users.findOneAndUpdate({ _id: user._id }, { password: md5(params.password), $unset: { resetPasswordToken: 1 } })
    log.end()
    return 'Password updated successfully.'
}

const setNewAdminPassword = async (params) => {
    const log = logger.start('user:service:setNewPassword')
    const user = await db.powerpanels.findOne({
        resetPasswordToken: params.resetPasswordToken
    })
    if (user == null || user == '' || user == undefined) {
        return 'Link expired.'
    }else{
         await db.powerpanels.findOneAndUpdate({ _id: user._id }, { password: md5(params.password), $unset: { resetPasswordToken: 1 } })
        log.end()
        // return 'Password updated successfully.'
    }
    
}

const employerProfileStep1 = async (params) => {
    const log = logger.start('user:service:employerProfileStep1')
    try {
        if (params.companyLogo && params.companyLogo != "") {

            params.imageId = params.companyLogo //  imageId
            const record = await fileService.moveFileFromTempToCdn(params)
            params.companyLogo = record._id
        }

        if (params.companyVideo && params.companyVideo != "") {

            params.imageId = params.companyVideo //  imageId
            const record = await fileService.moveFileFromTempToCdn(params)
            params.companyVideo = record._id
        }
        const refresh = await db.users.findOneAndUpdate({ _id: params.userId }, { $unset: { serviceId: 1 } })
        const obj = {
            fullName: params.fullName,
            // industryTypeId: params.industryTypeId,
            isCommercialVideo: params.isCommercialVideo,
            // registrationNumber: params.registrationNumber,
            // description: params.description,
            // companyVideo: params.companyVideo,
            //companyLogo: params.companyLogo,
            location: params.location,
            address: params.address,
            $push: { serviceId: params.serviceId },
            profileStepCompleted: 1
        }

        if (params.industryTypeId && params.industryTypeId != ""){
            obj.industryTypeId = params.industryTypeId
        }
        if (params.description && params.description != "" && params.description != null){
            obj.description = params.description
        } 

        if (params.companyLogo && params.companyLogo != ""){
            obj.companyLogo = params.companyLogo
        } 
        if (params.companyVideo && params.companyVideo != ""){
            obj.companyVideo = params.companyVideo
        } 
        if (params.registrationNumber && params.registrationNumber != "" && params.registrationNumber != undefined)
        {
             obj.registrationNumber = params.registrationNumber
        }
        const data = await db.users.findOneAndUpdate({ _id: params.userId }, obj)
        const data1 = await db.users.findOne({ _id: params.userId }, { companyLogo: 1 })
        log.end()
        return data1
    } catch (err) {
        return err.message || "Failure in profile Updation"
    }
}

const employerProfileStep2 = async (params) => {
    const log = logger.start('user:service:employerProfileStep2')
    const obj = {
        $set: { contactPerson: params.contactPerson },
        profileStepCompleted: 2
    }
    const data = await db.users.findOneAndUpdate({ _id: params.userId }, obj, { new: true })
    log.end()
    return data;
}

// general information

const employeeProfileStep1 = async (params) => {
    const log = logger.start('user:service:employeeProfileStep1')
    const data13 = await db.users.findOne({ _id: params.userId, profilePicId: params.profilePicId }, { profilePicId: 1 }).lean()
    
    if (data13) {
        params.profilePicId = data13.profilePicId
    }
    else if (params.profilePicId) {
        params.imageId = params.profilePicId //  imageId
        const record = await fileService.moveFileFromTempToCdn(params)
        params.profilePicId = record._id
    }
    
    const data12 = await db.users.findOne({ _id: params.userId }, { profileStepCompleted: 1 }).lean()
    var profileStepCompleted = 1;
    
    if (data12.profileStepCompleted == 4){
        profileStepCompleted = 4;
    } 
    
    const obj = {
        profilePicId: params.profilePicId,
        fullName: params.fullName,
        industryTypeId: params.industryTypeId,
        contactNumber: params.contactNumber,
        currentPositionId: params.currentPositionId,
        gender: params.gender,
        dob: params.dob,
        profileStepCompleted: profileStepCompleted,
        $set: { disability: { disabilityStatus: params.disability.disabilityStatus, description: params.disability.description },
        skills: params.skills,
        languageId: params.languageId,
        address: params.address},
    }
    await db.users.findOneAndUpdate({ _id: params.userId }, obj, { new: true })
    const data1 = await db.users.findOne({ _id: params.userId }, { profileStepCompleted: profileStepCompleted })
    log.end()
    return data1
}

const employeeProfileStep2 = async (params) => {
    const log = logger.start('user:service:employeeProfileStep2')

    const data12 = await db.users.findOne({ _id: params.userId }, { profileStepCompleted: 1 }).lean()

    var profileStepCompleted = 2

    if (data12.profileStepCompleted == 4) profileStepCompleted = 4;

    if (params._id) {
        let Update = {
            $pull: { qualification: { _id: params._id } }
        }
        const updatedData = await db.users.findOneAndUpdate({ _id: params.userId }, Update, { new: true })
    }

    const qualification = {
        $push: { qualification: params.qualification },
        $set: { profileStepCompleted: profileStepCompleted }
    }

    const data = await db.users.findOneAndUpdate({ _id: params.userId }, qualification, { new: true })
    const data1 = await db.users.findOne({ _id: params.userId }, { profileStepCompleted: profileStepCompleted, qualification: 1 })

    log.end()
    return data1
}

//employment information


const employeeProfileStep3 = async (params) => {
    const log = logger.start('user:service:employeeProfileStep3')

    const data12 = await db.users.findOne({ _id: params.userId }, { profileStepCompleted: 1 }).lean()

    var profileStepCompleted = 3;
    if (data12.profileStepCompleted == 4)
        profileStepCompleted = 4;

    if (params._id) {
        let Update = {
            $pull: { employmentInfo: { _id: params._id } }
        }
        const updatedData = await db.users.findOneAndUpdate({ _id: params.userId }, Update, { new: true })
    }

    const employmentInfo = {
        $set: { profileStepCompleted: profileStepCompleted },

        $push: { employmentInfo: params.employmentInfo }

    }
    const data = await db.users.findOneAndUpdate({ _id: params.userId }, employmentInfo, { new: true })
    let experience = await userExperience(params);
    let exp = await db.users.findOneAndUpdate({ _id: params.userId }, { totalExperience: experience })
    const data1 = await db.users.findOne({ _id: params.userId }, { profileStepCompleted: 1, employmentInfo: 1 })
    log.end()
    return data1

}


// step 4 of employee information

const employeeProfileStep4 = async (params) => {
    const log = logger.start('user:service:employeeProfileStep4')
    const data12 = await db.users.findOne({ _id: params.userId }, { profileStepCompleted: 1, bio: 1 }).lean();
    var profileStepCompleted = 3

    if (data12.profileStepCompleted == 4) profileStepCompleted = 4

    if (data12.bio && !params.bio) params.bio = data12.bio;

    const certificateId = await db.users.findOne({ _id: params.userId }, { "document.certificateId": 1 }).lean()
    if (params.certificateId && params.certificateId.length > 0) {
        params.certificateId.forEach(async (obj1) => {
            let index = -2;            
            if (certificateId && certificateId.document != {} && certificateId.document.certificateId && certificateId.document.certificateId.length > 0) {
                index = certificateId.document.certificateId.findIndex(certificateId => certificateId == obj1.toString())
            }

            if (index <= -1) {
                params.imageId = obj1 //  certificateId
                const record = await fileService.moveFileFromTempToCdn(params)
                obj1 = record._id
                const data = await db.users.findOneAndUpdate({ _id: params.userId }, { $push: { "document.certificateId": obj1 } }, { new: true });
            }
        });
    }

    const cvId = await db.users.findOne({ _id: params.userId }, { "document.cvId": 1 }).lean()
    //for uploading cv
    if (cvId && cvId.document.cvId && cvId.document.cvId == params.cvId) {
        params.cvId = cvId.document.cvId
    } else if (params.cvId) {
        params.imageId = params.cvId //  cvId
        const record = await fileService.moveFileFromTempToCdn(params)
        params.cvId = record._id
    }

    // for uploading pvr
    const pvrId = await db.users.findOne({ _id: params.userId }, { "document.pvrId": 1 }).lean()
    //for uploading cv

    if (pvrId && pvrId.document.pvrId && pvrId.document.pvrId == params.pvrId) {
        params.pvrId = pvrId.document.pvrId
    } else if (params.pvrId) {
        params.imageId = params.pvrId //  pvrId
        const record = await fileService.moveFileFromTempToCdn(params)
        params.pvrId = record._id
    }

    const data = await db.users.findOneAndUpdate({ _id: params.userId }, { $set: { "document.cvId": params.cvId, "document.pvrId": params.pvrId, profileStepCompleted: 4, bio: params.bio } }, { new: true })
    const data1 = await db.users.findOne({ _id: params.userId }, { profileStepCompleted: 1 })

    log.end()
    return data1

}
// qualification information

const deleteEmployeeProfileStep2 = async (params) => {
    const log = logger.start('user:service:deleteEmployeeProfileStep2')
    let Update = {
        $pull: { qualification: { _id: params._id } }
    }
    const updatedData = await db.users.findOneAndUpdate({ _id: params.userId }, Update, { new: true });
    log.end();
    return "Qualification data deleted successfully";
}

//employment information


const deleteEmployeeProfileStep3 = async (params) => {
    const log = logger.start('user:service:deleteEmployeeProfileStep3')
    let Update = {
        $pull: { employmentInfo: { _id: params._id } }
    }
    const updatedData = await db.users.findOneAndUpdate({ _id: params.userId }, Update, { new: true });
    log.end();
    return "EmploymentInfo deleted successfully";
}


// step 4 of employee information

const deleteEmployeeProfileStep4 = async (params) => {
     
    const log = logger.start('user:service:deleteEmployeeProfileStep4')
    if (params.certificateId) {
        const data = await db.users.findOneAndUpdate({ _id: params.userId }, 
            { $pull: { "document.certificateId": params.certificateId } }, { new: true })
    }
    if (params.cvId) {
        const data = await db.users.findOneAndUpdate({ _id: params.userId }, { $set: { "document.cvId": null } }, { new: true })
    }
    if (params.pvrId) {
        const data = await db.users.findOneAndUpdate({ _id: params.userId }, { $set: { "document.pvrId": null } }, { new: true })
    }
    log.end();
    return "Deleted successfully";
}

// if(data1.userRole == "employer"){
//     dataToSave = { $inc: { "graphData.companyPageView": 1 } }
// }

const companyProfile = async (params) => {
    const log = logger.start('user:service:companyProfile')
    let index = params.userData.followedCompanies.findIndex(companyId => companyId.toString() == params.companyId.toString());
    let data = await db.users.findOne({ _id: params.companyId }, {
        _id: 1,
        address: 1,
        companyLogo: 1,
        serviceId: 1,
        industryTypeId: 1,
        companyFollowers: 1,
        "rating.averageRating": 1,
        contactPerson: 1,
        companyVideo: 1,
        registrationNumber: 1,
        email: 1,
        bio: 1,
        fullName: 1,
        description:1,
        companyVideo: 1
    })
        .populate({ path: "industryTypeId", select: "name" })
        .populate({ path: "serviceId", select: "name" })
        .populate({ path: "contactPerson.position", select: "name" })
        .lean();
    data.isFollowed = false;
    if (index > -1) data.isFollowed = true;
    return data;
}

const skipStep = async (params) => {
    const log = logger.start('user:service:skipStep')

    const data = await db.users.findOneAndUpdate({ _id: params.userId }, { $set: { profileStepCompleted: params.stepNumber } }) //
    const data1 = await db.users.findOne({ _id: params.userId }, { profileStepCompleted: 1 })

    log.end()
    return data1
}

const stepCompleted = async (params) => {
    const log = logger.start('user:service:stepCompleted')
    var obj = {}
    if (params.step == 1) {
        obj = { $set: { profileStep1Status: 1 } }
    } else if (params.step == 2) {
        obj = { $set: { profileStep2Status: 1 } }
    } else if (params.step == 3) {
        obj = { $set: { profileStep3Status: 1 } }
    } else if (params.step == 4) {
        obj = {
            $set: { profileStep4Status: 1 }
        }
    }
    const data = await db.users.findOneAndUpdate({ _id: params.userId }, obj, { new: true });
    log.end()
    return data
}


const userProfile = async (params) => {
    const log = logger.start('user:service:userProfile')
    const check = await db.users.findOne({ _id: params.associateId }, { accountPrivacyStatus: 1 }, { lean: true })
    if (check.accountPrivacyStatus == 1) {
        const data = await db.users.findOne({ _id: params.associateId }, {}, { lean: true })
    } else if (check.accountPrivacyStatus == 2) {
        const data = await db.users.findOne({ _id: params.associateId, userRole: "employee" }, { email: 0, contactNumber: 0, dob: 0, address: 0 }, { lean: true })
    }
    log.end()
    return data
}

const accountPrivacy = async (params) => {
    const log = logger.start('user:service:accountPrivacy')
    const data = await db.users.findOneAndUpdate({ _id: params.userId }, { $set: { accountPrivacyStatus: params.accountPrivacyStatus } })
    log.end()
    return data
}

const followUnfollowCompany = async (params) => {
    const log = logger.start('user:service:followUnfollowCompany');
    let index = params.userData.followedCompanies.findIndex(companyId => companyId.toString() == params.companyId.toString());
    if (params.followingStatus == 1 && index == -1) {
        const data = await db.users.findOneAndUpdate({ _id: params.userId }, { $push: { followedCompanies: params.companyId } }, { new: true })
        const data1 = await db.users.findOneAndUpdate({ _id: params.companyId }, { $inc: { companyFollowers: 1 } })
        let response = true
        return response

    } else if (params.followingStatus == 2) {
        const data = await db.users.findOneAndUpdate({ _id: params.userId }, { $pull: { followedCompanies: params.companyId } })
        const data1 = await db.users.findOneAndUpdate({ _id: params.companyId }, { $inc: { companyFollowers: -1 } })
        let response = false
        return response
    }

    log.end()
    //return data
}

const review = async (params) => {
    const log = logger.start('user:service:review')
    const obj = {
        $push: { review: params }
    }
    const data = await db.users.findOneAndUpdate({ _id: params.toUser }, obj, { new: true })
    const data2 = await db.users.findOne({ _id: params.toUser }, { "review.ratingGiven": 1 }, { lean: true })
    var sumRating = await db.users.findOne({ _id: params.toUser }, { "rating.totalRating": 1 }, { lean: true })
    var total = await sumRating.rating.totalRating
    total = await total + params.ratingGiven
    const ratingIncrement = await db.users.findOneAndUpdate({ _id: params.toUser }, { $inc: { "rating.noOfRatings": 1 } })
    const ratingNumber = await db.users.findOne({ _id: params.toUser }, { "rating.noOfRatings": 1 }, { lean: true })
    var avgRatings = await total / ratingNumber.rating.noOfRatings
    const data1 = await db.users.findOneAndUpdate({ _id: params.toUser }, { $set: { "rating.totalRating": total, "rating.averageRating": avgRatings } })
    log.end()
    return data1
    // return 'review working properly'
}

const myPva = async (params) => {
    const log = logger.start('user:service:myPva')
    const data = await db.users.find({ _id: params.userInfo._id }, { "document.pvaId": 1 }, { lean: true });
    log.end()
    return data
}

// const savedJobs = async (params) => {  
//     const log = logger.start('user:service:savedJobs')
//     const data=await db.users.findOneAndUpdate({_id:params.userId},{$push:{savedJobs:params.jobId}})
//     return data
//     log.end()
// }

const blockUser = async (params) => {
    const log = logger.start('user:service:blockUser')

    // blocked users check to change if associate connected count need to be changed or not

    const data = await db.users.findOneAndUpdate({ _id: params.userId }, { $push: { blockedUsers: params.contactId } })
    const data1 = await db.users.findOneAndUpdate({ _id: params.contactId }, { $push: { userBlockedBy: params.userId } })
    log.end();
    return "user Blocked successfullty" //data,data1
}

const unblockUser = async (params) => {
    const log = logger.start('employee:service:unblockUser')

    // blocked users check to change if associate connected count need to be changed or not

    const data = await db.users.findOneAndUpdate({ _id: params.userId }, { $pull: { blockedUsers: params.contactId } })
    const data1 = await db.users.findOneAndUpdate({ _id: params.contactId }, { $pull: { userBlockedBy: params.userId } })

    log.end()
    return "user unblocked successfully" //data,data1
}

const sendConnectionRequest = async (params) => {
    const log = logger.start('user:service:sendConnectionRequest')
    const obj = {
        $push: { associateRequests: { toContactId: params.toContactId, from: params.userId, requestStatus: 1 } }
    }

    const data = await db.users.findOneAndUpdate({ _id: params.toContactId }, obj, { new: true }).lean();
    //requests sents are to be also stored
    const data1 = await db.users.findOneAndUpdate({ _id: params.userId }, { $push: { sentRequests: { toContactId: params.toContactId, requestStatus: 1 } } }, { new: true });
    log.end()
    return "connection request send successfully";

}


const acceptConnectionRequest = async (params) => {
    const log = logger.start('user:service:acceptConnectionRequest')

    const obj = {
        $push: { associateConnected: { contactId: params.contactId, requestStatus: 2 } },
        $pull: { associateRequests: { from: params.contactId } }
    }

    const data = await db.users.findOneAndUpdate({ _id: params.userId }, obj, { lean: true })

    // if the associate accpets the request associate connected should also reflect in request sender's list
    const obj1 = {
        $pull: { sentRequests: { toContactId: params.userId } },
        $push: { associateConnected: { contactId: params.userId, requestStatus: 2 } },
        $inc: { "graphData.inviteesAccepted": 1 }
    }
    const data1 = await db.users.findOneAndUpdate({ _id: params.contactId }, obj1, { new: true });

    //sending notification===========start========================

    const payload={
        userInfo: params.userInfo,
        pushMessage: params.userInfo.firstName + " has requested you.",
        reciverId: params.contactId,
        type: 5
    }

    const notify = await notifications.sendPushNotification(payload)

    //sending notification===========end========================

    log.end();
    return "accepted Request";
}

const showConnectionRequest = async (params) => {
    const log = logger.start('user:service:showConnectionRequest');
    const check1 = await db.users.findOne({ _id: params.userId, "associateRequests.requestStatus": 1 }, { associateRequests: 1 }, { lean: true });
    let check1Id = [];
    if (check1) {
        for (let i = 0; i < check1.associateRequests.length; i++) {
            check1Id[i] = check1.associateRequests[i].from
        }
        let data = [];
        for (let j = 0; j < check1Id.length; j++) {
            data[j] = await db.users.findOne({ userRole: "employee", profileStepCompleted: 4, _id: check1Id[j] }, { _id: 1, currentPositionId: 1, address: 1, fullName: 1, profilePicId: 1 }).lean().skip(0).limit(2)

        }
        let res = []
        let obj1 = {
            _id: "",
            address: {},
            fullName: "",
            currentPositionName: "",
            profilePicId: "",

        }
        let counter = 0
        for (counter = 0; counter < data.length; counter++) {
            const x = await db.currentPosition.findOne({ "_id": data[counter].currentPositionId }, { name: 1, _id: 1 }).lean();
            if (x != null) {
                obj1 = {
                    _id: data[counter]._id,
                    address: data[counter].address,
                    fullName: data[counter].fullName,
                    currentPositionName: x.name,
                    profilePicId: data[counter].profilePicId,
                };
                res[counter] = obj1
            }
        }
        log.end()
        return res;
    } else {
        log.end()
        return "No requests";
    }
}

const rejectConnectionRequest = async (params) => {
    const log = logger.start('user:service:rejectConnectionRequest')

    const obj = {
        $pull: { associateRequests: { from: params.contactId } }
    }

    const data = await db.users.findOneAndUpdate({ _id: params.userId }, obj, { lean: true })

    // should also reflect the change in the sent requests of the sender

    const data1 = await db.users.findOneAndUpdate({ _id: params.contactId }, { $pull: { sentRequests: { toContactId: params.userId } }, $inc: { "graphData.applicationsWithdraw": 1 } })


    return "Rejected Request"
    log.end()
}

const followingJobs = async (params) => {
    const log = logger.start('users:service:followingJobs')
    const check1 = await db.users.findOne({ _id: params.userInfo._id }, { savedJobs: 1 }, { lean: true })
   
    var data = await db.job.aggregate([{ $match: { "companyId": { $in: params.userInfo.followedCompanies } } }, //is deleted check or job closed checks
    {
        $lookup: {
            from: "users",
            localField: "companyId",
            foreignField: "_id",
            as: "companyName"
        }
    },
    { $match : { status : 1 } },
    {
        $project: {
            jobTitle: 1,
            description: 1,
            maxSalary: 1,
            minSalary: 1,
            skillsRequired: 1,
            jobPostedDate: 1,
            "companyName.fullName": 1,
            "companyName.companyLogo": 1,
            "companyName.address": 1,
            savingStatus: 1,
            disableEligibleStatus: 1,
            jobType: 1,
            selectcurrencyid:1
        }
    },
    //{$sort:{maxSalary:-1}},
    { $skip: params.query.skip || 0 },
    { $limit: params.query.limit || 10 }
    ])
    const res = await services.jobFormat(data, check1)
    

    log.end()
    return res
}




const saveJobs = async (params) => {
    const log = logger.start('user:service:saveJobs')
    const obj = {
        $push: { savedJobs: params.jobId }
    }
    const obj1 = {
        $pull: { savedJobs: params.jobId }
    }
    if (params.saveJobStatus == "true") {
        const data = await db.users.findOneAndUpdate({ _id: params.userId }, obj, { lean: true })
        return "job saved"
    } else if (params.saveJobStatus == "false") {
        const data = await db.users.findOneAndUpdate({ _id: params.userId }, obj1, { lean: true })
        return "job unsaved"
    }
    log.end()
}


const viewSavedJobs = async (params) => {
    const log = logger.start('users:service:viewSavedJobs')

    const data = await db.job.aggregate([{ $match: { "_id": { $in: params.userInfo.savedJobs } } }, //is deleted check or job closed checks
    {
        $lookup: {
            from: "users",
            localField: "companyId",
            foreignField: "_id",
            as: "companyName"
        }
    },
    {
        $project: {
            jobTitle: 1,
            description: 1,
            maxSalary: 1,
            minSalary: 1,
            skillsRequired: 1,
            jobPostedDate: 1,
            "companyName.fullName": 1,
            "companyName.companyLogo": 1,
            "companyName.address": 1,
            "selectcurrencyid":1,
        }
    }
    ])
    if(data.companyName != undefined && data.companyName != null && data.companyName != ''){
        for (var i = 0; i < data.length; i++) {
            data[i].companyNames = data[i].companyName[0].fullName
            data[i].companyLogo = data[i].companyName[0].companyLogo
            data[i].companyFullAddress = data[i].companyName[0].address.fullAddress
            data[i].companyCity = data[i].companyName[0].address.city
        }
    }
    let res = []
    let counter = 0

    var obj1 = {
        _id: "",
        jobTitle: "",
        minSalary: 0,
        description: "",
        maxSalary: 0,
        skillsRequired: [],
        jobPostedDate: 0,
        savingStatus: 0,
        disableEligibleStatus: 0,
        jobType: "",
        companyNames: " ",
        companyLogo: " ",
        companyFullAddress: "",
        companyCity: "",
        isSaved: true,
        selectcurrencyid:""
    }

    //for(var i=0;i<data.length;i++)
    for (counter = 0; counter < data.length; counter++)
    //await data.forEach(async (obj) =>
    {
        const x = await db.skills.find({ "_id": { $in: data[counter].skillsRequired } }, { name: 1, _id: 1 }, { lean: true })

        obj1 = {
            _id: data[counter]._id,
            jobTitle: data[counter].jobTitle,
            description: data[counter].description,
            maxSalary: data[counter].maxSalary,
            minSalary: data[counter].minSalary,
            skillsRequired: x,
            jobPostedDate: data[counter].jobPostedDate,
            savingStatus: data[counter].savingStatus,
            disableEligibleStatus: data[counter].disableEligibleStatus,
            jobType: data[counter].jobType,
            companyNames: data[counter].companyNames,
            companyLogo: data[counter].companyLogo,
            companyFullAddress: data[counter].companyFullAddress,
            companyCity: data[counter].companyCity,
            isSaved: true,
            selectcurrencyid:data[counter].selectcurrencyid,
        }
        res[counter] = obj1
        //counter ++

    }
    return res;
}






const inviteForJob = async (params) => {
    let count = 0;
    const log = logger.start('user:service:inviteForJob')
    const userDetails1 = await db.users.findOne({ _id: params.userId },{jobInvites:1});
    userDetails1.jobInvites.forEach((values) => {
        if(values.jobId == params.jobId){
            count++; 
        }
    })
    if(count > 0){
        return false
        // return {message:"Already Invite for this job!"}
    }
    const obj1 = {
        $push: { jobInvites: { jobId: params.jobId, jobInviteStatus: 1 } }
    }
    const obj2 = {
        $push: { invitedCandidates: { candidateId: params.candidateId, jobId: params.jobId, JobInviteStatus: 1 } }
    }
    const userDetails = await db.users.findOneAndUpdate({ _id: params.userId }, obj1, { new: true }).lean();
    const candidate = await db.users.findOne({ _id: params.candidateId }).lean();
    const jobDetails = await db.job.findOneAndUpdate({ _id: params.jobId }, obj2, { new: true }).lean();
    const jobTitle = jobDetails.jobTitle
    // should also reflect the change in the sent requests of the sender
    offline.queue('user', 'interviewschedule', {
        id: candidate._id,
        message:`Employer has invited you for the job ${jobTitle}.`   
    }, {})
  
    log.end()
    return userDetails, jobDetails
}


// const acceptInvite = async (params) => {  
//     const log = logger.start('user:service:acceptInvite')
//     return data
//     log.end()
// }

const applyForJob = async (params) => {
    const log = logger.start('user:service:applyForJob')

    const company = await db.job.findOne({ _id: params.jobId }, { companyId: 1 })
    // appply check for the invited candidate and update it to the applied jobs and applied candidates
    let dataToSave = {}
    if (params.applyingWithType == 1) //with pvr
    {
        // dataToSave = { $inc: { "graphData.applicationsMade": 1},"graphData.pvrReceived": 1   }
        dataToSave = { $inc: { "graphData.applicationsMade": 1,"graphData.pvrReceived": 1 }  }
    }
    else 
    {
        // dataToSave = { $inc: { "graphData.applicationsMade": 1 }, "graphData.pvaReceived": 1, "graphData.pvaSentIn": 1 }
        dataToSave = { $inc: { "graphData.applicationsMade": 1 , "graphData.pvaReceived": 1, "graphData.pvaSentIn": 1 }}
    }
    await db.users.findOneAndUpdate({ _id: company.companyId }, dataToSave)
    if (params.applyingWithType == 2) //with pvr
    {
        /* status chnage 0 and 1 */
        const userData =await db.users.findOne({ _id: params.userId });
        var documentData = userData.document;
        var user_pva = documentData.pvaId;
        var pva_length = user_pva.length;
        var pvastatus = 1;
        for (let index = 0; index < user_pva.length; index++) {
            if(user_pva[index].pva_id == params.pvaId){
                pvastatus = 0;
            }            
        }
        if (pvastatus == 1) {
            params.imageId = params.pvaId //  imageId
            const record = await fileService.moveFileFromTempToCdn(params)
            params.pvaId = record._id
            var pvadata = {
                pva_id: record._id,
                pva_name: 'video - ' + (pva_length + 1),
                pva_date: moment().unix()
            }
            user_pva.push(pvadata);
        }
        const obj1 = {
            $push: { appliedJobs: { jobId: params.jobId, applyingWithType: 2, applicationStatus: 1 } },
        }
        
        const obj2 = {
            $push: { appliedCandidates: { candidateId: params.userId, applicationStatus: 1, appliedWithType: 2, pvaId: params.pvaId } }
        }
        const obj3 = {
            document: {
                pvaId: user_pva,
                certificateId:documentData.certificateId, 
                pvrId: documentData.pvrId,
                cvId: documentData.cvId
            }
        }

        const data = await db.users.findOneAndUpdate({ _id: params.userId }, obj1, { new: true })
        const data1 = await db.users.findOneAndUpdate({ _id: params.userId }, obj3, { new: true })
        const data2 = await db.job.findOneAndUpdate({ _id: params.jobId }, obj2, { new: true })

        return data, data1, data2
    } else if (params.applyingWithType == 1) //with pva
    {
        const obj3 = {
            $push: { appliedCandidates: { candidateId: params.userId, applicationStatus: 1, appliedWithType: 1 } }
        }
        const obj4 = {
            $push: { appliedJobs: { jobId: params.jobId, applyingWithType: 1, applicationStatus: 1} },
        }
        const data1 = await db.job.findOneAndUpdate({ _id: params.jobId }, obj3, { new: true })

        const data2 = await db.users.findOneAndUpdate({ _id: params.userId }, obj4, { new: true })

        return data1, data2

    }
    
    log.end()
}

// let userDetails = await db.users.findOne({ _id: params.userId, "appliedJobs.applicationStatus": 3 }, { appliedJobs: 1 }, { lean: true });
// if(userDetails == undefined && userDetails == null) {
//     return [];
// }

const acceptRejectCandidate = async (params) => { 
    const log = logger.start('users:service:acceptRejectCandidate')
    if (params.payload.accepted == 1) {
        const user = await db.users.findOneAndUpdate({ _id: params.payload.candidateId, "appliedJobs.jobId": params.payload.jobId }, { $set: { "appliedJobs.$.applicationStatus": 2 } }) //,{new:true})
        const job = await db.job.findOneAndUpdate({ _id: params.payload.jobId, "appliedCandidates.candidateId": params.payload.candidateId }, { $set: { "appliedCandidates.$.applicationStatus": 2 } }) //,{new:true})
        let jobTitle =  job.jobTitle;

        if(params.userInfo.userRole == 'employer'){
            const obj ={
                id: params.payload.candidateId,
                message:`Employer has accepted your job application for ${jobTitle}.`
            }
            emailNotification(obj)
        }
        return user, job
    } else if (params.payload.accepted == 2) {
        const user = await db.users.findOneAndUpdate({ _id: params.payload.candidateId, "appliedJobs.jobId": params.payload.jobId }, { $set: { "appliedJobs.$.applicationStatus": 8 } }) //{new:true})
        const job = await db.job.findOneAndUpdate({ _id: params.payload.jobId, "appliedCandidates.candidateId": params.payload.candidateId }, { $set: { "appliedCandidates.$.applicationStatus": 8 } }) //,{new:true})
        let jobTitle =  job.jobTitle; 
            if(params.userInfo.userRole == 'employer'){
                const obj ={
                    id: params.payload.candidateId,
                    message:`Employer has rejected your job application for ${jobTitle}.`
                }
                emailNotification(obj)
            }
        return user, job
    }
    log.end()
}

const emailNotification = (params) =>{
    const id = params.id;
    const message = params.message;
    offline.queue('user', 'interviewschedule', {
        id: id,
        message:message
    }, {})
}

const acceptRejectFromCandidate = async (params) => { 
    const log = logger.start('users:service:acceptRejectCandidate')

    if (params.accepted == 1) {
        const user = await db.users.findOneAndUpdate({ _id: params.candidateId, "appliedJobs.jobId": params.jobId }, { $set: { "appliedJobs.$.applicationStatus": 2 } }) //,{new:true})
        const job = await db.job.findOneAndUpdate({ _id: params.jobId, "appliedCandidates.candidateId": params.candidateId }, { $set: { "appliedCandidates.$.applicationStatus": 2 } }) //,{new:true})
        let jobTitle =  job.jobTitle;
        offline.queue('user', 'interviewschedule', {
            id: params.candidateId,
            message:`Employer has accepted your job application for ${jobTitle}.`
        }, {})
        return user, job
    } else if (params.accepted == 2) {
        const user = await db.users.findOneAndUpdate({ _id: params.candidateId, "appliedJobs.jobId": params.jobId }, { $set: { "appliedJobs.$.applicationStatus": 8 } }) //{new:true})
        const job = await db.job.findOneAndUpdate({ _id: params.jobId, "appliedCandidates.candidateId": params.candidateId }, { $set: { "appliedCandidates.$.applicationStatus": 8 } }) //,{new:true})
        return user, job
    }

    log.end()
}



const scheduleInterview = async (request, params) => {
    const log = logger.start('users:service:scheduleInterview')

    await db.job.update({ _id: params.jobId, "appliedCandidates.candidateId": params.candidateId }, { $set: { "appliedCandidates.$.timeSlots": [] } })

    await db.users.update({ _id: params.candidateId, "appliedJobs.jobId": params.jobId }, { $set: { "appliedJobs.$.timeSlots": [] } })

    const obj = {
        $set: { "appliedJobs.$.applicationStatus": 3, "appliedJobs.$.interviewingStatus": 1 },
        // $push: { "appliedJobs.$.timeSlots": { $each: [params.slot1, params.slot2, params.slot3] } }
        $push: { "appliedJobs.$.timeSlots": { $each: [params.slot1, params.slot2, params.slot3] } }
    }

    const obj1 = {
        $set: { "appliedCandidates.$.applicationStatus": 3, "appliedCandidates.$.interviewingStatus": 1 },
        $push: { "appliedCandidates.$.timeSlots": { $each: [params.slot1, params.slot2, params.slot3] } }

    }

    const userDetails = await db.users.update({ _id: params.candidateId, "appliedJobs.jobId": params.jobId }, obj)
    const jobDetails = await db.job.findOneAndUpdate({ _id: params.jobId, "appliedCandidates.candidateId": params.candidateId }, obj1)


    await db.users.findOneAndUpdate({ _id: request }, { $inc: { "graphData.interviewInviteSent": 1 } });

    //sending notification===========start========================

    const payload = {
        userInfo: params.userInfo,
        pushMessage: params.userInfo.firstName + " has schedule your interview for " + jobDetails.jobTitle + " .",
        reciverId: userDetails._id,
        type: 3
    }
    const jobTitle = jobDetails.jobTitle;
    const notify = await notifications.sendPushNotification(payload);
    offline.queue('user', 'interviewschedule', {
        id: params.candidateId,
        message:`Employer has scheduled a Job Interview for your job application for ${jobTitle}.`
    }, {})
    
    //sending notification===========end========================

    log.end()   
    return "schedule interview successfully";
    // return userDetails, jobDetails;
}



const referJobs = async (params) => {
    const log = logger.start('users:service:referJobs')

    // can refer jobs only to the associates connected

    // send to multiple associates at the same time
    const obj = {
        $push: { referredJobs: { jobId: params.jobId, refferedBy: params.userId } }
    }

    let data;
    for (const index in params.associateId) {
        data = await db.users.findOneAndUpdate({ _id: params.associateId[index] }, obj, { new: true })
    }


    //sending notification===========start========================

    const payload={
        userInfo: params.userInfo,
        pushMessage: params.userInfo.firstName + " has refer to job",
        reciverId: params.userId,
        type: 1
    }

    const notify = await notifications.sendPushNotification(payload)

    //sending notification===========end========================

    return "Referred successfully"

}




const selectInterviewTime = async (params) => {
    const log = logger.start('users:service:selectInterviewTime')
    const obj = {
        $set: {
            "appliedJobs.$.applicationStatus": 4,
            "appliedJobs.$.interviewingStatus": 2,
            "appliedJobs.$.interviewTime": params.interviewTime
        }
    }
    const obj1 = {
        $set: {
            "appliedCandidates.$.applicationStatus": 4,
            "appliedCandidates.$.interviewingStatus": 2,
            "appliedCandidates.$.interviewTime": params.interviewTime
        }
    }

    if (params.candidateId && params.candidateId != "") {
        params.userId = params.candidateId
    }
    const data = await db.users.update({ _id: params.userId, "appliedJobs.jobId": params.jobId }, obj)
    const data1 = await db.job.update({ _id: params.jobId, "appliedCandidates.candidateId": params.userId }, obj1)
    log.end()
    // return data,data1
}



const hireRejectCandidate = async (params) => {
    const log = logger.start('users:service:hireRejectCandidate')
    var userDataToUpdate, jobDataToUpdate, payload;
    let userCriteria = { _id: params.candidateId, "appliedJobs.jobId": params.jobId };
    let jobCriteria = { _id: params.jobId, "appliedCandidates.candidateId": params.candidateId };
    if (params.hiringStatus == 1) {
        userDataToUpdate = { $set: { "appliedJobs.$.applicationStatus": 5 } };
        jobDataToUpdate = { $set: { "appliedCandidates.$.applicationStatus": 5 } };
        await db.users.findOneAndUpdate({ _id: params.userId }, { $inc: { "graphData.hiredCandidates": 1 } });
        payload = {
            userInfo: params.userInfo,
            pushMessage: "Congratulations you are hired!",
            reciverId: params.candidateId,
            type: 6
        }
    } else {
        userDataToUpdate = { $set: { "appliedJobs.$.applicationStatus": 8 } };
        jobDataToUpdate = { $set: { "appliedCandidates.$.applicationStatus": 8 } };

        payload = {
            userInfo: params.userInfo,
            pushMessage: "Sorry you are rejected!",
            reciverId: params.candidateId,
            type: 5
        }
    }
    const userData = await db.users.update(userCriteria, userDataToUpdate);
    const jobData = await db.job.update(jobCriteria, jobDataToUpdate);
    //sending notification===========start========================

    const notify = await notifications.sendPushNotification(payload)

    //sending notification===========end========================
    log.end()
    return "Candidate hire/reject successfully"
}





const viewReferredJobs = async (params) => {
    const log = logger.start('users:service:viewReferredJobs')

    // to check the saved job status

    // const check1 = await db.users.findOne({ _id: params.userId }, { savedJobs: 1 }, { lean: true })

    const data = await db.users.findOne({ _id: params.userId }, { referredJobs: 1 }, { lean: true })

    // the job format and setting the job format as well
    log.end()
    return data

}


const viewAssociateConnected = async (params) => {
    const log = logger.start('users:service:viewAssociateConnected')

    // to check the saved job status

    const check1 = await db.users.findOne({ _id: params.userId }, { savedJobs: 1 }, { lean: true });


    const data = await db.users.findOne({ _id: params.userId }, { associateConnected: 1 }, { lean: true });
    let check1Id = []
    if (data) {
        for (let i = 0; i < data.associateConnected.length; i++) {
            check1Id[i] = data.associateConnected[i].contactId
        }

        let data1 = []

        for (let j = 0; j < check1Id.length; j++) {

            data1[j] = await db.users.findOne({ userRole: "employee", profileStepCompleted: 4, _id: check1Id[j] }, { _id: 1, currentPositionId: 1, address: 1, fullName: 1, profilePicId: 1 }, { lean: true }).skip(0).limit(2)
        }

        let res = []
        let obj1 = {
            _id: "",
            address: {},
            fullName: "",
            currentPositionName: "",
            profilePicId: "",
            isFollowing: ""

        };
        let counter = 0
        for (counter = 0; counter < data1.length; counter++) {
            const x = await db.currentPosition.findOne({ "_id": data1[counter].currentPositionId }, { name: 1, _id: 1 }, { lean: true });
            if (x != null) //(data[counter].industryTypeId!=="" || data[counter].industryTypeId!=null )
            {
                obj1 = {
                    _id: data1[counter]._id,
                    address: data1[counter].address,
                    fullName: data1[counter].fullName,
                    currentPositionName: x.name,
                    profilePicId: data1[counter].profilePicId,
                    isFollowing: true
                }
                res[counter] = obj1
            }

        }
        return res;
    } else {
        return "no associate connected"
    }
}

const viewAppliedJobs = async (params) => {
    const log = logger.start('users:service:viewAppliedJobs')
    // to check the saved job status
    const check1 = await db.users.findOne({ _id: params.userId }, { savedJobs: 1 }, { lean: true })
    const data = await db.users.findOne({ _id: params.userId, "appliedJobs.applicationStatus": { $in: [1, 2, 3, 4, 5, 6] } }, { appliedJobs: 1 }, { lean: true });
    var array = []
    if (data == null){
        return []
    }
    else if(data !== null || data.appliedJobs !== null){
        for (let i = 0; i < data.appliedJobs.length; i++) {
            array.push(data.appliedJobs[i].jobId)
        }
    }
    //check or job closed checks
    var data1 = await db.job.aggregate([{ $match: { _id: { $in: array } } },
    {
        $lookup: {
            from: "users",
            localField: "companyId",
            foreignField: "_id",
            as: "companyName"
        }
    },
    {
        $project: {
            jobTitle: 1,
            description: 1,
            maxSalary: 1,
            minSalary: 1,
            skillsRequired: 1,
            jobPostedDate: 1,
            "companyName.fullName": 1,
            "companyName.companyLogo": 1,
            "companyName.address": 1,
            savingStatus: 1,
            disableEligibleStatus: 1,
            jobType: 1,
            selectcurrencyid:1
        }
    },
    ]);

    let ret = []
    let ret2 = {}
    for (let i = 0; i < data.appliedJobs.length; i++) {
        ret2._id = data.appliedJobs[i].jobId;
        ret[i] = ret2;
    }
    const res = await jobService.jobFormat(data1, check1);
    // the job format
    log.end()
    return res;
}


const viewInterviewingRequests = async (params) => {
    let userData;
    const log = logger.start('users:service:viewInterviewingRequests')
    // to check the saved job status
    let userDetails = await db.users.findOne({ _id: params.userId, "appliedJobs.applicationStatus": 3 }, { appliedJobs: 1 }, { lean: true });
    if(userDetails == undefined && userDetails == null) {
        return [];
    }
    // let userDetails = await db.users.findOne({$and: [{
    //     _id: params.userId
    // },
    //  { appliedJobs: { $elemMatch: {applicationStatus:3} } }]},
    //  { appliedJobs: 1 }, { lean: true });
     for (const iterator of userDetails.appliedJobs) {
         if (iterator.applicationStatus != 5) {
             let jobDetails = await db.job.findOne({ _id: iterator.jobId }, { jobTitle: 1, companyId: 1 }, { lean: true })
             .populate({
                 path: "companyId",
                 select: "fullName"
                })
                iterator.jobTitle = jobDetails.jobTitle;
                iterator.companyName = jobDetails.companyId.fullName;
                delete iterator.companyId;
            }
        }
        log.end()
        userData = userDetails.appliedJobs
        var filtered = userData.filter((value, index, arr) =>{
            return value.applicationStatus != 2 && value.applicationStatus != 1 && value.applicationStatus != 4 && value.applicationStatus != 5 && value.applicationStatus != 6 && value.applicationStatus != 7 && value.applicationStatus != 8 ;
        });
        userDetails.appliedJobs = filtered
        const formatted = moment.unix(1563737400).format("MMMM-DD-YYYY HH:mm a");
    return userDetails;

}

const viewInterviewing = async (params) => {
    const log = logger.start('users:service:viewInterviewing')

    // to check the saved job status
    // const check1 = await db.users.findOne({ _id: params.userId }, { savedJobs: 1 }, { lean: true })

    const data = await db.users.findOne({ _id: params.userId, "appliedJobs.applicationStatus": 4 }, { appliedJobs: 1 }, { lean: true })
        .populate({ path: "appliedJobs.jobId" })

    // the job format
    var res = []

    if (data) {
        for (let counter = 0; counter < data.appliedJobs.length; counter++)
        //await data.forEach(async (obj) =>
        {
            const x = await db.skills.find({ "_id": { $in: data.appliedJobs[counter].jobId.skillsRequired } }, { name: 1, _id: 1 }, { lean: true });
            const y = await db.users.findOne({ _id: data.appliedJobs[counter].jobId.companyId });
            let obj1 = {
                _id:data.appliedJobs[counter].jobId._id,
                jobInviteStatus: data.appliedJobs[counter].jobInviteStatus,
                jobTitle: data.appliedJobs[counter].jobId.jobTitle,
                description: data.appliedJobs[counter].jobId.description,
                maxSalary: data.appliedJobs[counter].jobId.maxSalary,
                minSalary: data.appliedJobs[counter].jobId.minSalary,
                selectcurrencyid:data.appliedJobs[counter].jobId.selectcurrencyid,
                skillsRequired: x,
                jobPostedDate: data.appliedJobs[counter].jobId.jobPostedDate,
                savingStatus: data.appliedJobs[counter].jobId.savingStatus,
                disableEligibleStatus: data.appliedJobs[counter].jobId.disableEligibleStatus,
                jobType: data.appliedJobs[counter].jobId.jobType,
                companyNames: y.fullName,
                companyLogo: y.companyLogo,
                companyFullAddress: y.address.fullAddress,
                companyCity: y.address.city,


            }
            res[counter] = obj1
            //counter ++
        }
    }
    log.end()
    return res;
}



const viewOfferedJobs = async (params) => {
    const log = logger.start('users:service:viewOfferedJobs')

    // to check the saved job status

    const check1 = await db.users.findOne({ _id: params.userId }, { savedJobs: 1 }, { lean: true });

    const data = await db.users.findOne({ _id: params.userId, "appliedJobs.applicationStatus": 5 }, { appliedJobs: 1 }, { lean: true })
    if (data == null){
        return []

    }

    var array = []
    for (let i = 0; i < data.appliedJobs.length; i++) {
        array.push(data.appliedJobs[i].jobId)
    }

    //check or job closed checks
    var data1 = await db.job.aggregate([{ $match: { _id: { $in: array } } },
    {
        $lookup: {
            from: "users",
            localField: "companyId",
            foreignField: "_id",
            as: "companyName"
        }
    },
    {
        $project: {
            jobTitle: 1,
            description: 1,
            maxSalary: 1,
            minSalary: 1,
            selectcurrencyid:1,
            skillsRequired: 1,
            jobPostedDate: 1,
            "companyName.fullName": 1,
            "companyName.companyLogo": 1,
            "companyName.address": 1,
            savingStatus: 1,
            disableEligibleStatus: 1,
            jobType: 1,
        }
    },
    ])

    // the job format
    const res = await jobService.jobFormat(data1, check1);
    log.end()
    return res

}



const withdrawApplication = async (params) => {
    const log = logger.start('users:service:withdrawApplication')
    const obj = {
        $pull: { appliedJobs: { jobId: params.jobId } }
    }
    const data = await db.users.findOneAndUpdate({ _id: params.userId }, obj, { lean: true })

    const obj1 = {
        $pull: { appliedCandidates: { candidateId: params.userId } }
    }
    const data1 = await db.job.findOneAndUpdate({ _id: params.jobId }, obj1, { lean: true })

    log.end()
    return "withdraw Application  api working" //data
}



const viewCompanyJobs = async (params) => {
    const log = logger.start('users:service:viewCompanyJobs')

    // for checking the status of the job if saved or not

    const check1 = await db.users.findOne({ _id: params.userId }, { savedJobs: 1 }, { lean: true });

    const data = await db.job.aggregate([{ $match: { companyId: { $in: [mongoose.Types.ObjectId(params.companyId)] } } }, //is deleted check or job closed checks
    {
        $lookup: {
            from: "users",
            localField: "companyId",
            foreignField: "_id",
            as: "companyName"
        }
    },
    {
        $project: {
            jobTitle: 1,
            description: 1,
            maxSalary: 1,
            minSalary: 1,
            skillsRequired: 1,
            jobPostedDate: 1,
            "companyName.fullName": 1,
            "companyName.companyLogo": 1,
            "companyName.address": 1,
            "selectcurrencyid":1
        }
    },
    { $skip: params.skip } || 0, { $limit: params.limit || 10 }
    ]);
    
    const res = await services.jobFormat(data, check1);

    // response format of the job display

    // const res= await jobFormat(data,check1)

    log.end()
    return res;
}



const viewBlockedUsers = async (params) => {
    const log = logger.start('users:service:viewBlockedUsers')
    // const data=await db.users.find({_id:params.userId},{blockedUsers:1},{skip:params.skip,limit:params.limit})

    const data = await db.users.findOne({ _id: params.userId }, { blockedUsers: 1 }, { lean: true }).skip(params.skip).limit(params.limit);
    let data1 = []
    if (data.blockedUsers != "") {
        for (let i = 0; i < data.blockedUsers.length; i++) {
            data1[i] = await db.users.findOne({ userRole: "employee", profileStepCompleted: 4, _id: data.blockedUsers[i] }, { _id: 1, currentPositionId: 1, address: 1, fullName: 1, profilePicId: 1 }, { lean: true }).skip(0).limit(2)
        }
        let res = []
        let obj1 = {
            _id: "",
            address: {},
            fullName: "",
            currentPositionName: "",
            profilePicId: "",
            //isFollowing:""

        }
        let counter = 0
        for (counter = 0; counter < data1.length; counter++) {
            const x = await db.currentPosition.findOne({ "_id": data1[counter].currentPositionId }, { name: 1, _id: 1 }, { lean: true });
            if (x != null) //(data[counter].industryTypeId!=="" || data[counter].industryTypeId!=null )
            {
                obj1 = {
                    _id: data1[counter]._id,
                    address: data1[counter].address,
                    fullName: data1[counter].fullName,
                    currentPositionName: x.name,
                    profilePicId: data1[counter].profilePicId,
                    //isFollowing:true
                }
                res[counter] = obj1
            }
        }
        return res;
    } else {
        return "no blocked users"
    }
}




const searchCompanies = async (params) => {
    const log = logger.start('users:service:searchCompanies')

    const check1 = await db.users.findOne({ _id: params.userId }, { followedCompanies: 1 }, { lean: true });

    const data = await db.users.find({ userRole: "employer", fullName: new RegExp(params.name, "i") }, { companyLogo: 1, industryTypeId: 1, fullName: 1, address: 1 }, { lean: true }).limit(params.limit).skip(params.skip)

    if (check1.followedCompanies != "") {

        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < check1.followedCompanies.length; j++) {
                if (data[i]._id.toString() === check1.followedCompanies[j].toString()) {
                    data[i].followingStatus = 1;
                    break
                } else if (check1.followedCompanies[j].toString() !== data[i]._id.toString()) {
                    data[i].followingStatus = 0
                }
            }
        }
    } else if (check1.followedCompanies == "") {

        for (var i = 0; i < data.length; i++) {
            data[i].followingStatus = 0
        }

    }

    for (const element of data) {
        if (element.industryTypeId) {
            const x = await db.industryType.findOne({ "_id": element.industryTypeId }, { name: 1, _id: 1 }, { lean: true })
            element.industryTypeName = x.name;
            delete element.industryTypeId
        }
    }

    log.end()
    return data;
}

const searchAssociates = async (params) => {
    const log = logger.start('users:service:searchAssociates')

    const check1 = await db.users.findOne({ _id: params.userId }, { userBlockedBy: 1, blockedUsers: 1 }).lean();
    //check if blocked users and blocked by are empty

    const userData = await db.users.find({ userRole: "employee", profileStepCompleted: 4, fullName: new RegExp(params.name, "i"), $or: [{ _id: { $nin: check1.userBlockedBy } }, { _id: { $nin: check1.blockedUsers } }] }, { _id: 1, fullName: 1, address: 1, profilePicId: 1, currentPositionId: 1 }).populate({path: "currentPositionId", select: "name"}).lean();
    userData.forEach(element => {
        element.currentPositionName = element.currentPositionId.name;
        delete element.currentPositionId;
    });
    log.end();
    return userData;
}

const companyList = async (params) => {
    const log = logger.start('users:service:companyList')
    const check1 = await db.users.findOne({ _id: params.userId }, { followedCompanies: 1 }, { lean: true })
    // check for blocking
    let res = []
    let obj1 = {
        _id: "",
        address: {},
        fullName: "",
        industryTypeName: "",
        profilePicId: "",

    }
    const data = await db.users.find({ userRole: "employer", profileStepCompleted: { $in: [1, 2] } }, { companyLogo: 1, industryTypeId: 1, fullName: 1, address: 1 })
    let counter = 0
    for (counter = 0; counter < data.length; counter++) {
        const x = await db.industryType.findOne({ "_id": data[counter].industryTypeId }, { name: 1, _id: 1 }, { lean: true })

        if (x != null) //(data[counter].industryTypeId!=="" || data[counter].industryTypeId!=null )
        {

            //     obj1.name=x.name
            //     obj1._id=x._id
            //     delete data[counter]["industryTypeId"]
            //     data[counter]["industryTypeId"]=obj1
            obj1 = {
                _id: data[counter]._id,
                address: data[counter].address,
                fullName: data[counter].fullName,
                industryTypeName: x.name,
                profilePicId: data[counter].companyLogo,
            }
            res.push(obj1)
        }
        obj1 = {
                _id: data[counter]._id,
                address: data[counter].address,
                fullName: data[counter].fullName,
                // industryTypeName: x.name,
                profilePicId: data[counter].companyLogo,
            }
            res.push(obj1)
    }

    if (check1.followedCompanies != "") {
        console.log('check1.followedCompanies',check1.followedCompanies)

        for (var i = 0; i < res.length; i++) {
            console.log('data==>',data[i])
            if(data[i] !== undefined){
                console.log('inside the if')
                for (var j = 0; j < check1.followedCompanies.length; j++) {
                    if (res[i]._id.toString() === check1.followedCompanies[j].toString()) {
                        res[i].followingStatus = 1
                        break
                    } else if (check1.followedCompanies[j].toString() !== data[i]._id.toString()) {
                        res[i].followingStatus = 0
                    }
                }    
            }
            
        }
    } else if (check1.followedCompanies == "") {

        for (var i = 0; i < res.length; i++) {
            res[i].followingStatus = 0
        }

    }

    // const check1= await db.users.findOne({_id:params.userId},{blockedUsers:1},{lean:true})
    // //const check2=
   
    // const data=await db.users.find({userRole:"employee",fullName:new RegExp(params.name,"i"),_id:{$nin:[check1.blockedUsers]}})  ///*.sort({serviceName:1})*/.limit(params.limit).skip(params.skip)
    console.log('res',res)
    log.end()
    return res

}



const associateList = async (params) => {
    const log = logger.start('users:service:associateList');
    console.log('associateList',params.userId)
    const fetchConnected = [], fetchNotConnected = [];
    const check1 = await db.users.findOne({ _id: params.userId, "associateConnected.requestStatus": 2 }, { "associateConnected.contactId": 1 }).populate({ path: "associateConnected.contactId", model: "users", select: "currentPositionId address fullName profilePicId", populate: { path: "currentPositionId", select: "name" } }).lean();
    console.log('check1',check1)
    // checking for the block scenario

    const data = await db.users.find({ userRole: "employee", profileStepCompleted: 4 }, { _id: 1, currentPositionId: 1, address: 1, fullName: 1, profilePicId: 1 }).populate({ path: "currentPositionId", select: "name" }).lean().skip(params.skip).limit(params.limit);
    console.log('data',data)
    //for checking associate connection status
    if (data && data.length > 0) {
        await data.forEach(element => {
            element.currentPositionName = element.currentPositionId.name;
            delete element.currentPositionId;
            let index;
            if (check1 && check1.associateConnected && check1.associateConnected.length > 0) {
                index = check1.associateConnected.findIndex(item => item.contactId._id.toString() == element._id.toString());
            }
            if (index > -1) {
                element.isConnected = true;
                fetchConnected.push(element);
            } else {
                element.isConnected = false;
                fetchNotConnected.push(element);
            }
        });

        if (params.fetchConnected == false) {
            return fetchNotConnected;
        } else if (params.fetchConnected == true) {
            return fetchConnected;
        } else {
            return data;
        }
    } else return "No associated connection are there";
}


// const searchCompanies = async (params) => {
//     const log = logger.start('users:service:searchCompanies')
//     const check1=await db.users.findOne({_id:params.userId},{followedCompanies:1},{lean:true})
//     const data=await db.users.find({userRole:"employer",},{_id:1,currentPositionId:1,address:1,name:1,profilePicId:1},{lean:true})
//     //for checking associate connection status
//     log.end()
//     return data
// }






const fetchFeaturedCandidate = async (params) => {
    const log = logger.start('users:service:fetchFeaturedCandidate')

    const data = await db.users.find({ userRole: "employee", profileStepCompleted: { $gte: 4 } }, { _id: 1, currentPositionId: 1, address: 1, name: 1, profilePicId: 1, totalExperience: 1 }, { lean: true });
    log.end();
    return data;
}



const changeWorkingStatus = async (params) => {
    const log = logger.start('users:service:changeWorkingStatus')

    const data = await db.users.findOneAndUpdate({ _id: params.userId }, { currentWorkingStatus: params.isWorking }, { lean: true })




    log.end()
    return data

}



const candidateStats = async (params) => {
    const log = logger.start('users:service:candidateStats')

    let applicants = 0
    //  const data=await db.job.find({companyId:params.userId},{_id:1, appliedCandidates:1},{lean:true})

    let obj = {}
    // working for finding applicants

    const data1 = await db.job.aggregate([{
        "$match": { companyId: mongoose.Types.ObjectId(params.userId) }
    },
    { $unwind: "$appliedCandidates" },
    { $count: "applicants" },

    ])
    // finding the no of interviewing candidates
    const data2 = await db.job.aggregate([
        { "$match": { companyId: mongoose.Types.ObjectId(params.userId) } },
        { $unwind: "$appliedCandidates" },
        { $match: { "appliedCandidates.applicationStatus": 4 } }, // change the application status acc to the need
        { $count: "interviewing" },
    ])
    // finding the no of offered jobs to candidates

    const data3 = await db.job.aggregate([
        { "$match": { companyId: mongoose.Types.ObjectId(params.userId) /*,"appliedCandidates.applicationStatus":5 */ } },
        { $unwind: "$appliedCandidates" }, 
        { $match: { "appliedCandidates.applicationStatus": 5 } }, // change the application status acc to the need
        { $count: "offered" },

    ])
    if (data1 != "")
        obj.applicants = data1[0].applicants // total job applicants
    else
        obj.applicants = 0

    if (data2 != "")
        obj.interviewing = data2[0].interviewing //interviewing jobs
    else
        obj.interviewing = 0

    if (data3 != "")
        obj.offered = data3[0].offered // job offered
    else
        obj.offered = 0

    if (data1 != "" && data3 != "")
        obj.candidatePlaced = parseFloat((obj.offered / obj.applicants) * 100) // in percentage
    else
        obj.candidatePlaced = 0

        log.end()

    return obj

}



const employerJobStats = async (params) => {
    const log = logger.start('users:service:employerJobStats')

    let currentTime = moment().unix()

    let weekAgoTime = currentTime - 604800

    
    let currentMonth = moment(currentTime * 1000).format('MM')
    let lastMonth = 0
    if (currentMonth == 1) {
        lastMonth = 12 // if current month is january
    } else {
        lastMonth = currentMonth - 1 // for all other months
    }

    const data = await db.job.find({ companyId: params.userId }, { jobPostedDate: 1 })

    let obj = {}
    obj.monthlyJobs = 0
    obj.lastMonthJobs = 0
    obj.weeklyJobs = 0
    let months = []
    for (let i = 0; i < data.length; i++) {
        months[i] = parseInt(moment(data[i].jobPostedDate).format('MM'))

        if (months[i] == currentMonth) {
            obj.monthlyJobs++
        } else if (months[i] == lastMonth) {
            obj.lastMonthJobs++
        }

        // for checking the number of weekly Jobs


        if (data[i].jobPostedDate >= weekAgoTime * 1000 && data[i].jobPostedDate <= currentTime * 1000) {

            obj.weeklyJobs++
        }
    }

    obj.currentJobPosted = await db.job.find({ companyId: params.userId, status: 1 }).count()

    return obj;

}


const reportUser = async (params) => {
    const log = logger.start('users:service:reportUser')
    let report = {}
    report.reporterName = await db.users.findOne({ _id: params.userId }, { fullName: 1, email: 1 })
    let fullName = await db.users.findOne({ _id: params.employeeId }, { fullName: 1, email: 1 })
    report.fullName = fullName.fullName
    report.reportedEmail = fullName.email
    report.message = params.reportReason
    


    //offline.queue('user', 'sign-up',{id: user.id}, {})

    offline.queue('report', 'reportIssue', { report }, {})

    log.end()
    return "data"

}



const userExperience = async (params) => {
    const log = logger.start('users:service:userExperience')


    const startDate = await db.users.aggregate([
        { $match: { _id: params.userId } },
        { $unwind: "$employmentInfo" },
        {
            "$project": {
                "experience": { $subtract: ["$employmentInfo.to", "$employmentInfo.from"] }
            }
        },
        { $group: { "_id": null, "totalExperience": { $sum: "$experience" } } }
    ])
    let data = startDate[0].totalExperience
    log.end()
    return data

}


const searchEmployee = async (params) => {
    const log = logger.start('users:service:searchEmployee')

    let obj = {},
        data

    if (params.pincode != "") {
        obj = { "address.pincode": params.pincode }
    }

    obj.profileStepCompleted = 4
    obj.userRole = "employee"

    if (params.jobTitle != "") {
        obj.employmentInfo = {
            $elemMatch: {
                jobTitle: new RegExp(params.jobTitle, 'i')
            }
        }
    }


    if (params.skills != "") {
        obj.skills = { $in: params.skills }
    }

    data = await db.users.find(obj, { employmentInfo: 1, _id: 1, fullName: 1, totalExperience: 1, profilePicId: 1, isWorking: 1, "document.pvrId": 1 },{ lean: true }).sort({_id: -1})



    if (data.length > 0) return data
    return "no result found"


} 


const searchEmployeeFilter = async (params) => {
    const log = logger.start('users:service:searchEmployeeFilter')

    let obj = {}
    obj.userRole = { $eq: "employee" }

    if (params.disablityStatus != -1) {
        obj["disability.disabilityStatus"] = { $eq: params.disablityStatus }
    }


    if (params.expLowerLimit !== -1 && params.expUpperLimit !== -1) {
        obj.totalExperience = { $gte: params.expLowerLimit, $lte: params.expUpperLimit }
    }

    if (params.rating !== -1) {
        obj["rating.averageRating"] = { $gte: params.rating }
    }

    if (params.minDistance !== -1 && params.maxDistance !== -1) {
        const q = await db.users.findOne({ _id: params.userId }, { location: 1 }, { lean: true })

        // let lattitude = await parseFloat(q.location.coordinates[0])
        // let longitude = await parseFloat(q.location.coordinates[1])

        let lattitude = await parseFloat(q.location && q.location.coordinates ? q.location.coordinates[0] : 0)
        let longitude = await parseFloat(q.location && q.location.coordinates ? q.location.coordinates[1] : 0)


        var locationId = await db.users.aggregate([{
            $geoNear: {
                near: { type: "point", "coordinates": [lattitude, longitude] },
                distanceField: "dist.calculated",
                spherical: true,
                $minDistance: params.minDistance * 1609.344,
                $maxDistance: params.maxDistance * 1609.344 //11.111999965975954
            }
        },
        { $project: { _id: 1 } } //,"dist.calculated":1}}
        ])
        let arr = []
        for (var xyz = 0; xyz < locationId.length; xyz++) {
            arr[xyz] = locationId[xyz]._id
        }
        obj._id = { $in: arr }
    }

    const data = await db.users.find(obj, { _id: 1, fullName: 1, totalExperience: 1, profilePicId: 1, currentPositionId: 1, "document.pvrId": 1, isWorking: 1 })

    // rating

    // maxDistance
    log.end()
    return data

}


const reviewEmployee = async (params) => {
    const log = logger.start('users:service:reviewEmployee')

    const obj = {
        $push: { review: params.review }
    }

    const data = await db.users.findOneAndUpdate({ _id: params.review.toUser }, obj, { new: true })
    const data2 = await db.users.findOne({ _id: params.review.toUser }, { "review.ratingGiven": 1 }, { lean: true })
    var sumRating = await db.users.findOne({ _id: params.review.toUser }, { "rating.totalRating": 1 }, { lean: true })
    
    var total = await sumRating.rating.totalRating
    total = await total + params.review.ratingGiven
    const ratingIncrement = await db.users.findOneAndUpdate({ _id: params.review.toUser }, { $inc: { "rating.noOfRatings": 1 } })
    const ratingNumber = await db.users.findOne({ _id: params.review.toUser }, { "rating.noOfRatings": 1 }, { lean: true })
    var avgRatings = await total / ratingNumber.rating.noOfRatings
    const data1 = await db.users.findOneAndUpdate({ _id: params.review.toUser }, { $set: { "rating.totalRating": total, "rating.averageRating": avgRatings } })

    //sending notification===========start========================

    const payload = {
        userInfo: params.userInfo,
        pushMessage: params.review.reviewDetail,
        reciverId: params.review.toUser,
        type: 6
    }

    const notify = await notifications.sendPushNotification(payload)

    //sending notification===========end========================


    log.end()
    return data1


}


const fetchRecommendedEmployees = async (params) => {
    const log = logger.start('users:service:fetchRecommendedEmployees')

    const data = await db.job.findOne({ _id: params.jobId }, { skillsRequired: 1 })
    let obj = {}
    obj.skills = { $in: data.skillsRequired } //.toString()}
    obj.userRole = { $eq: "employee" }
    obj.subscriptionStatus = { $eq: 1 }

    const data1 = await db.users.find(obj, { /*skills:1,*/ _id: 1, fullName: 1, totalExperience: 1, currentWorkingStatus: 1, profilePicId: 1 }) //,{lean:true})

    log.end()
    return data1

}



const inviteRecommendedEmployees = async (params) => {
    const log = logger.start('users:service:inviteRecommendedEmployees')

    let obj = {}
    let res = []

    for (let j = 0; j < params.candidateId.length; j++) {
        obj.candidateId = params.candidateId[j]
        obj.jobId = params.jobId
        obj.userId = params.candidateId[j]
        res = await inviteForJob(obj)
        //sending notification===========start========================
        const payload = {
            userInfo: params.userInfo,
            pushMessage: params.userInfo.fullName + " has invited for " + res.jobTitle +".",
            reciverId: params.candidateId[j],
            type: 2
        }
        const notify = await notifications.sendPushNotification(payload)
        
        //sending notification===========end========================
    }
    let obj1;
    if(res == false){
           obj1 ={
            "isSuccess": false,
            "status": "fail",
            "statusCode": 422,
            "message":"Already Invite for this job"
           } 
            
    }else{
          obj1 ={
            "isSuccess": true,
            "status": "success",
            "statusCode": 200,
            "message":"Invite recommended to employees suceessfully"
           } 
    }
    return obj1
}


const contactUs = async (params) => {
    const log = logger.start('users:service:contactUs')
    params.createdAt = moment().unix();
    await db.contactus(params).save();


    offline.queue('user', 'contactus', {
        params:params
    }, {})
    log.end()
    return "Message sent successfully";
}

const registrationappUs = async (params) => {
    const log = logger.start('users:service:registrationappUs')
    params.createdAt = moment().unix();
    await db.registrationappus(params).save();


    offline.queue('user', 'registrationappus', {
        params:params
    }, {})
    log.end()
    return "Message sent successfully";
}


const viewInvitedJobs = async (params) => {
    const log = logger.start('users:service:viewInvitedJobs')

    const data = await db.users.findOne({ _id: params.userId }, { jobInvites: 1 }, { lean: true })
        .populate({ path: "jobInvites.jobId", model: "job" })

    var res = []
    for (let counter = 0; counter < data.jobInvites.length; counter++)
    //await data.forEach(async (obj) =>
    {
        const x = await db.skills.find({ "_id": { $in: data.jobInvites[counter].jobId.skillsRequired } }, { name: 1, _id: 1 }, { lean: true })
        const y = await db.users.findOne({ _id: data.jobInvites[counter].jobId.companyId })
        let obj1 = {
            _id:data.jobInvites[counter].jobId._id,
            jobInviteStatus: data.jobInvites[counter].jobInviteStatus,
            jobTitle: data.jobInvites[counter].jobId.jobTitle,
            description: data.jobInvites[counter].jobId.description,
            maxSalary: data.jobInvites[counter].jobId.maxSalary,
            minSalary: data.jobInvites[counter].jobId.minSalary,
            selectcurrencyid: data.jobInvites[counter].jobId.selectcurrencyid,
            skillsRequired: x,
            jobPostedDate: data.jobInvites[counter].jobId.jobPostedDate,
            savingStatus: data.jobInvites[counter].jobId.savingStatus,
            disableEligibleStatus: data.jobInvites[counter].jobId.disableEligibleStatus,
            jobType: data.jobInvites[counter].jobId.jobType,
            companyNames: y.fullName,
            companyLogo: y.companyLogo,
            companyFullAddress: y.address.fullAddress,
            companyCity: y.address.city

        }
        res.push(obj1);
        // res[counter] = obj1
        //counter ++
    }
    log.end()
    return res.reverse();
}


const searchFeaturedCandidate = async (params) => {
    const log = logger.start('users:service:searchFeaturedCandidate')

    let obj = {},
        data

    if (params.pincode != "") {
        obj = { "address.pincode": params.pincode }
    }

    obj.profileStepCompleted = 4
    obj.userRole = "employee"
    obj.subscriptionStatus = 1

    if (params.jobTitle != "") {
        obj.employmentInfo = {
            $elemMatch: {
                jobTitle: new RegExp(params.jobTitle, 'i')
            }
        }
    }


    if (params.skills != "") {
        obj.skills = { $in: params.skills }
    }

    data = await db.users.find(obj, { _id: 1, fullName: 1, totalExperience: 1, profilePicId: 1, isWorking: 1, "document.pvrId": 1 }, { lean: true })


    if (data.length > 0) return data;
    return "no result found"


}




const filterFeaturedCandidate = async (params) => {
    const log = logger.start('users:service:filterFeaturedCandidate')

    let obj = {
        // disability:{}
    }
    obj.userRole = { $eq: "employee" }
    obj.subscriptionStatus = { $eq: 1 }
    let abc = '1'
    if (params.disablityStatus != -1) {

        obj["disability.disabilityStatus"] = { $eq: params.disablityStatus } //.toString()}
    }


    if (params.expLowerLimit !== -1 && params.expUpperLimit !== -1) {

        obj.totalExperience = { $gte: params.expLowerLimit, $lte: params.expUpperLimit }
    }

    if (params.rating !== -1) {
        obj["rating.averageRating"] = { $gte: params.rating }
    }

    if (params.minDistance != -1 && params.maxDistance !== -1) {
        const q = await db.users.findOne({ _id: params.userId }, { location: 1 }, { lean: true })
        let lattitude = await parseFloat(q.location && q.location.coordinates ? q.location.coordinates[0] : 0)
        let longitude = await parseFloat(q.location && q.location.coordinates ? q.location.coordinates[1] : 0)
        var locationId = await db.users.aggregate([{
            $geoNear: {
                near: { type: "point", "coordinates": [lattitude, longitude] },
                distanceField: "dist.calculated",
                spherical: true,
                $minDistance: params.minDistance * 1609.344,
                $maxDistance: params.maxDistance * 1609.344
                // maxDistance: params.maxDistance * 1609.344 //11.111999965975954
            }
        },
        { $project: { _id: 1 } } //,"dist.calculated":1}}
        ])
        let arr = []
        for (var xyz = 0; xyz < locationId.length; xyz++) {
            arr[xyz] = locationId[xyz]._id
        }
        obj._id = { $in: arr }
    }

    const data = await db.users.find(obj, { _id: 1, fullName: 1, totalExperience: 1, profilePicId: 1, currentPositionId: 1, "document.pvrId": 1, isWorking: 1 })

    log.end()
    return data

}


const selfProfile = async (params) => {
    const data = await db.users.findOne({ _id: params.userId }, {
        _id: 1,
        address: 1,
        fullName: 1,
        location: 1,
        companyLogo: 1,
        serviceId: 1,
        industryTypeId: 1,
        description: 1,
        companyFollowers: 1,
        "rating.averageRating": 1,
        contactPerson: 1,
        companyVideo: 1,
        email: 1,
        dob: 1,
        bio: 1,
        gender: 1,
        contactNumber: 1,
        languageId: 1,
        registrationNumber: 1,
        currentPositionId: 1,
        skills: 1,
        disability: 1,
        qualification: 1,
        employmentInfo: 1,
        document: 1,
        profilePicId: 1,
        followedCompanies: 1,
        // totalCredits: 1,
        // availableCredits: 1,
        // usedCredits: 1,
    })
        .populate({ path: "skills", model: "skills", select: "name" })
        .populate({ path: "followedCompanies", select: "address fullName companyLogo description" })
        // .populate({ path: "currentPositionId", select: "currentPositionId" })
        .populate({ path: "industryTypeId", select: "name" })
        .populate({ path: "languageId", select: "name" })
        .populate({ path: "serviceId", select: "name" }).populate({ path: "industryTypeId", select: "name", model: "industryType" })

    return data
}
const availableCreditslist = async (params) => {
    const log = logger.start('users:service:availableCreditslist')

    const data = await db.users.findOne({ _id: params.userId }, {
        _id: 1,
        totalCredits: 1,
        availableCredits: 1,
        usedCredits: 1,
    })
    log.end()
    return data
}





const fetchCompanyReviews = async (params) => {
    const log = logger.start('users:service:fetchCompanyReviews')

    const check1 = await db.users.findOne({ _id: params.userId }, { review: 1 }, { lean: true })
    if (check1.review != "") {
        let counter = 0
        let res = []
        let data1 = {}
        let retObj = {
            profilePicId: "",
            _id: 1,
            reviewDetail: "",
            ratingGiven: 0,
            fullName: "",
            reviewTime: ""
            // currentPositionName:"",
        }

        for (let i = 0; i < check1.review.length; i++) {

            const userData = await db.users.findOne({ _id: check1.review[i].toUser }, { profilePicId: 1, _id: 1, fullName: 1, currentPositionId: 1 }, { lean: true })

            retObj = {
                profilePicId: userData.profilePicId ? userData.profilePicId : "",
                _id: userData._id,
                reviewDetail: check1.review[i].reviewDetail,
                ratingGiven: check1.review[i].ratingGiven,
                fullName: userData.fullName,
                reviewTime: check1.review[i].reviewTime
            }
            res[counter] = retObj
            counter++
        }
        // data1.res=res
        // data1.counter=counter
        log.end()
        return res //data1

    } else {
        return "No reviews"
    }
}



const creditDeductionEmployerProfile = async (params) => {
    const log = logger.start('users:service:creditDeductionEmployerProfile')
    let totalDeduction = 0
    let cvDeduction = 0
    let pvaDeduction = 0


    let cvv1 = {
        $push: { cvViewedOf: params.employeeId }
    }

    let pva1 = {
        $push: { pvaViewedOf: params.employeeId }
    }

    const cvStatus = await db.users.findOne({ _id: params.userId, cvViewedOf: params.employeeId }, { _id: 1, fullName: 1 })
    if (cvStatus) {
        cvDeduction = 0
    } else if (!cvStatus && params.cvCharges == 1) {
        const cvvStatus1 = await db.users.findOneAndUpdate({ _id: params.userId }, cvv1, { lean: true })
        cvDeduction = params.cvCharges
    }

    const pvaStatus = await db.users.findOne({ _id: params.userId, pvaViewedOf: params.employeeId }, { _id: 1, fullName: 1 })

    if (pvaStatus) {
        pvaDeduction = 0
    } else if (!pvaStatus && params.pvaCharges == 1) {
        const pvaStatus1 = await db.users.findOneAndUpdate({ _id: params.userId }, pva1, { lean: true })
        pvaDeduction = params.pvaCharges
    }

    totalDeduction = pvaDeduction + cvDeduction + params.pvrCharges
    const data = await db.users.findOneAndUpdate({ _id: params.userId }, { $inc: { creditLeft: -totalDeduction } })
    const data1 = await db.users.findOne({ _id: params.userId }, { creditLeft: 1 })
    return data1

}


const changeEmail = async (params) => {
    const log = logger.start('users:service:changeEmail')

    const oldUser = await getUserByEmail(params.newEmail)

    if (oldUser) {
        log.end()
        throw new Error('Email already exists')
    }

    // const oldEmailExist = await getUserByEmail(params.oldEmail)
    //if(oldEmailExist){
    const user = await db.users.findOne({ _id: params.userId }, {}, { lean: true })

    user.emailVerifyToken = auth.randomToken(user.id)
    const newData = await db.users.findOneAndUpdate({ _id: params.userId }, { email: params.newEmail, isEmailVerified: false, emailVerifyToken: user.emailVerifyToken })

    offline.queue('user', 'sign-up', {
        id: user._id
    }, {})

    log.end()

    return 'Follow the link in the verification email to start with Monada.'
    // }
    // else{
    //     throw new Error("Old email does not exists")
    // }
}

const cancelInterview = async (params) => {

    const obj = {
        $unset: {
            "appliedJobs.$.applicationStatus": 1,
            "appliedJobs.$.interviewingStatus": 1,
            "appliedJobs.$.interviewTime": 1,
            "appliedJobs.$.timeSlots": 1
        }
    }

    const obj1 = {
        $unset: {
            "appliedCandidates.$.applicationStatus": 1,
            "appliedCandidates.$.interviewingStatus": 1,
            "appliedCandidates.$.interviewTime": 1,
            "appliedCandidates.$.timeSlots": 1
        }
    }

    if (params.candidateId && params.candidateId != "") {
        params.userId = params.candidateId
    }


    const data = await db.users.update({ _id: params.userId, "appliedJobs.jobId": params.jobId }, obj, { new: true, multi: true })
    const data1 = await db.job.update({ _id: params.jobId, "appliedCandidates.candidateId": params.userId }, obj1, { new: true, multi: true })

    return "Cancelled Interview"


}

const socialLoginSignUp = async (params) => {

    
    let dataToSave = {}

    if (params.googleLoginId && params.googleLoginId != "")
        dataToSave.googleLoginId = params.googleLoginId

    if (params.facebookLoginId && params.facebookLoginId != "")
        dataToSave.facebookLoginId = params.facebookLoginId

    if (params.linkedInLoginId && params.linkedInLoginId != "")
        dataToSave.linkedInLoginId = params.linkedInLoginId

    const user = await db.users.findOne({ email: params.email, isDeleted: false })

    if (user && user.userRole.toString() != params.userRole.toString()) {
        throw new Error("Email already exists")
    }

    if (user && user.isSuspended) {
        throw new Error('Your account is suspended. To login, please contact your administrator.')
    }

    if (user) {
        params.userId = await db.users.findOneAndUpdate({ email: params.email, userRole: params.userRole }, dataToSave, { new: true })
    } else {
        dataToSave.email = params.email
        dataToSave.isEmailVerified = true
        dataToSave.userRole = params.userRole
        dataToSave.totalCredits = 150
        dataToSave.availableCredits = 150
        dataToSave.usedCredits = 0 
        params.userId = await db.users(dataToSave).save()
    }
    //generate accesstoken

    const obj = {
        timeStamp: moment().unix(),
        accessToken: auth.createToken(params.userId._id),
        timeZone: params.timeZone
    }

    const data = await db.users.findOneAndUpdate({ _id: params.userId._id }, { deviceDetails: obj }, { new: true })
    data.token = obj.accessToken
    return data

}

const deleteAccount = async (params) => {
    const deletedData = await db.users.findOneAndDelete({ _id: params.userId });
    return deletedData
}

const UpdatePvaName = async (params) => {
    const userData =await db.users.findOne({ _id: params.userId });

    var documentData = userData.document;
    var user_pva = documentData.pvaId;
    
    for (let index = 0; index < user_pva.length; index++) {
        if(user_pva[index].pva_id == params.pva_id && user_pva[index]._id == params._pvaid ){
            user_pva[index].pva_name = params.pva_name
        }            
    }    

    const obj3 = {
        document: {
            pvaId: user_pva,
            certificateId:documentData.certificateId, 
            pvrId: documentData.pvrId,
            cvId: documentData.cvId
        }
    }
    
    const data1 = await db.users.findOneAndUpdate({ _id: params.userId }, obj3, { new: true })
    return data1
}


const CheckingEmployeracces = async (params) => {
    const userData = await db.users.findOne({ _id: params.userId })
    var availableCredits = userData.availableCredits;
    var usedCredits = userData.usedCredits;
    const deductCredits = 2;
    const accessData = await db.employerAccess.find({
        employee_id: params.empId,
        employer_id: params.userId,
        view_type: params.view_type
    })

  
    if(accessData != '' && accessData != null && accessData != undefined){
        let data = {
            statusCode: 200,
            deducted: true,
            message: 'You have the access to view employee.',
        }
    
        return data
    }
    else {
        if(availableCredits < deductCredits){
            let data = {
                statusCode: 403,
                deducted: false,
                message: 'Sorry..!! Your credit is low. Please buy more credits.',
            }
            return data
        }
        else {
            const emp_data = {
                employee_id:params.empId,
                credit_amount: deductCredits,
                employer_id: params.userId,
                view_type : params.view_type
            }
            let acessData = await db.employerAccess(emp_data).save();
            availableCredits -= deductCredits
            usedCredits += deductCredits
            const obj1 = {
                availableCredits: availableCredits,
                usedCredits: usedCredits
            }
            if(params.view_type == "message" ){
                offline.queue('user', 'interviewschedule', {
                    id: params.empId,
                    message:"Employer want to chat with you regarding your job application"
                }, {})
            }
            else if(params.view_type == "pvr" ){
                offline.queue('user', 'interviewschedule', {
                    id: params.empId,
                    message:"Employer has viewed your Personal Video Resumes for your job application."
                }, {})
            } 
            const data1 = await db.users.findOneAndUpdate({ _id: params.userId }, obj1, { new: true })
            let data = {
                statusCode: 200,
                deducted: true,
                message: 'You have the access to view employee.',
            }
            return data;
        }
    }
}

const CheckingPVAnotification = async (params) => {
    const userid = '5d273c5de85b4802e87238a9'
    const userData =await db.users.findOne({ _id: userid });
   // return userData
}

const EmployersContactLeads = async (params) => {
        if( params.type == 'Employees'){
             params.type = "ENTREPRENEUR"
        }
        else{
            params.type = "INVESTOR"
        }
        const obj = {
            name:params.name || params.Empname,
            email:params.Empemail || params.email,
            reachOutTimeDate:params.tellus,
            message:params.description,
            contactNumber:params.contactNumber1 || params.contactnumber,
            role:params.type,
            submitedAt:moment().unix()
        }
    const data =await db.registrationappus(obj).save();
    offline.queue('user', 'employerslead', {
        params:data
    }, {})
    return "Message sent successfully";
}


const EmployeesContactLeads = async (params) => {
    const obj = {
        name:params.name,
        email:params.email,
        reachOutTimeDate:params.tellus,
        message:params.description,
        contactNumber:params.contactNumber1 || params.contactnumber,
        role:params.role,
        submitedAt:moment().unix()
    }
    const data =await db.employersContactLeads(obj).save();
    offline.queue('user', 'employerslead', {
        params:data
    }, {})
    return "Message sent successfully";
} 
exports.checkEmailExists = checkEmailExists
exports.logout = logout
exports.getEmail = getEmail
exports.signUp = signUp
exports.socialSignUp = socialSignUp
exports.verifyEmail = verifyEmail
exports.setNewPassword = setNewPassword
exports.setNewAdminPassword = setNewAdminPassword
exports.resetPasswordToken = resetPasswordToken
exports.getUserByEmail = getUserByEmail
exports.forgotPassword = forgotPassword
exports.changePassword = changePassword
exports.verifyResetPasswordToken = verifyResetPasswordToken
exports.verifyResetAdminPasswordToken = verifyResetAdminPasswordToken
exports.resendEmailVerificationLink = resendEmailVerificationLink
exports.employerProfileStep1 = employerProfileStep1
exports.employerProfileStep2 = employerProfileStep2
exports.employeeProfileStep1 = employeeProfileStep1
exports.employeeProfileStep2 = employeeProfileStep2
exports.employeeProfileStep3 = employeeProfileStep3
exports.employeeProfileStep4 = employeeProfileStep4

exports.deleteEmployeeProfileStep2 = deleteEmployeeProfileStep2
exports.deleteEmployeeProfileStep3 = deleteEmployeeProfileStep3
exports.deleteEmployeeProfileStep4 = deleteEmployeeProfileStep4
exports.companyProfile = companyProfile
exports.skipStep = skipStep
exports.userProfile = userProfile
exports.accountPrivacy = accountPrivacy
exports.followUnfollowCompany = followUnfollowCompany
exports.myPva = myPva
exports.review = review
exports.saveJobs = saveJobs
exports.blockUser = blockUser
exports.unblockUser = unblockUser
exports.sendConnectionRequest = sendConnectionRequest
exports.acceptConnectionRequest = acceptConnectionRequest
exports.showConnectionRequest = showConnectionRequest
exports.rejectConnectionRequest = rejectConnectionRequest
exports.followingJobs = followingJobs
exports.viewSavedJobs = viewSavedJobs
exports.inviteForJob = inviteForJob
//exports.acceptInvite=acceptInvite
exports.applyForJob = applyForJob
exports.stepCompleted = stepCompleted
exports.acceptRejectCandidate = acceptRejectCandidate
exports.acceptRejectFromCandidate = acceptRejectFromCandidate
exports.scheduleInterview = scheduleInterview
exports.referJobs = referJobs
exports.selectInterviewTime = selectInterviewTime
exports.withdrawApplication = withdrawApplication
exports.hireRejectCandidate = hireRejectCandidate
exports.viewOfferedJobs = viewOfferedJobs
exports.viewInterviewing = viewInterviewing
exports.viewReferredJobs = viewReferredJobs
exports.viewAppliedJobs = viewAppliedJobs
exports.viewAssociateConnected = viewAssociateConnected
exports.viewInterviewingRequests = viewInterviewingRequests
exports.viewCompanyJobs = viewCompanyJobs
exports.viewBlockedUsers = viewBlockedUsers
exports.searchCompanies = searchCompanies
exports.searchAssociates = searchAssociates
exports.companyList = companyList
exports.associateList = associateList
exports.fetchFeaturedCandidate = fetchFeaturedCandidate
exports.changeWorkingStatus = changeWorkingStatus
exports.candidateStats = candidateStats
exports.employerJobStats = employerJobStats
exports.reportUser = reportUser
exports.userExperience = userExperience
exports.searchEmployee = searchEmployee
exports.reviewEmployee = reviewEmployee
exports.fetchRecommendedEmployees = fetchRecommendedEmployees
exports.searchEmployeeFilter = searchEmployeeFilter
exports.inviteRecommendedEmployees = inviteRecommendedEmployees
exports.contactUs = contactUs
exports.registrationappUs = registrationappUs
exports.viewInvitedJobs = viewInvitedJobs
exports.searchFeaturedCandidate = searchFeaturedCandidate
exports.filterFeaturedCandidate = filterFeaturedCandidate
exports.selfProfile = selfProfile
exports.availableCreditslist = availableCreditslist
exports.fetchCompanyReviews = fetchCompanyReviews
exports.creditDeductionEmployerProfile = creditDeductionEmployerProfile
exports.changeEmail = changeEmail
exports.cancelInterview = cancelInterview
exports.socialLoginSignUp = socialLoginSignUp
exports.login = login
exports.deleteAccount = deleteAccount
exports.UpdatePvaName = UpdatePvaName
exports.CheckingEmployeracces = CheckingEmployeracces
exports.CheckingPVAnotification = CheckingPVAnotification
exports.EmployersContactLeads = EmployersContactLeads
exports.EmployeesContactLeads = EmployeesContactLeads