'use strict'

const mapper = require('../mapper')
const service = require('../service')
const path = require('path')

const signUp = async (request, h) => {
    try {
        if (request.payload.loginType == 1) {
            const message = await service.signUp(request.payload)
            return response.success(h, message)
        } else if (request.payload.loginType == 2 || request.payload.loginType == 3 || request.payload.loginType == 4) {
            if (request.loginType == 2) {

                //********* using facebook ********//
                request.payload["socialType"] = { facebookLoginId: request.payload.socialId }
                request.payload["check"] = { $or: [{ email: request.payload.email }, { facebookLoginId: request.payload.socialId }] };

            } else if (request.payload.loginType == 3) {

                //********* using google-plus ********//
                request.payload["socialType"] = { googleLoginId: request.payload.socialId };
                request.payload["check"] = { $or: [{ email: request.payload.email }, { googleLoginId: request.payload.socialId }] };

            } else if (request.payload.loginType == 4) {

                //********* using google-plus ********//
                request.payload["socialType"] = { linkedInLoginId: request.payload.socialId };
                request.payload["check"] = { $or: [{ email: request.payload.email }, { linkedInLoginId: request.payload.socialId }] };

            }




            const message = await service.socialSignUp(request.payload)
            return response.success(h, message)

        }
    } catch (err) {
        return response.failure(h, err.message)
    }
}

const login = async (request, h) => {
    const log = logger.start('users:api:login')
    try {
        const user = await service.login(request.payload)
        log.end()

        if (typeof(user) === 'string') {
            return response.failure(h, user)
        }

        return response.success(h, mapper.toModel(user), user.token).header('x-logintoken', user.token)
    } catch (err) {
        log.error(err)
        log.end()
        return response.accessDenied(h, err.message)
    }
}

const verifyEmail = async (request, h) => {
    const log = logger.start('users:api:verifyEmail')

    try {
        const user = await service.verifyEmail(request.query.token)
        console.log('user',user.userRole);
        if(user.userRole == "employee"){
            log.end()
            return h.file(path.join(__dirname, '../../../templates/user-appregister-success.html'))    
        }
        else if(user.userRole == "employer"){
            log.end()
        return h.file(path.join(__dirname, '../../../templates/user-register-success.html'))
        }
        // log.end()
        // return h.file(path.join(__dirname, '../../../templates/user-register-success.html'))
    } catch (err) {
        log.error(err)
        log.end()
        return h.file(path.join(__dirname, '../../../templates/user-register-failure.html'))
    }
}

const checkEmailExists = async (request, h) => {
    const log = logger.start('users:api:checkEmailExists')
    try {
        const message = await service.checkEmailExists(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const forgotPassword = async (request, h) => {
    const log = logger.start('users:api:forgotPassword')

    try {
        const message = await service.forgotPassword(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const resendEmailVerificationLink = async (request, h) => {
    const log = logger.start('users:api:resendEmailVerificationLink')

    try {
        const message = await service.resendEmailVerificationLink(request.payload.email)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const resetPasswordToken = async (request, h) => {
    const log = logger.start('users:api:resetPasswordToken')

    try {
        const message = await service.resetPasswordToken(request.query.token)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const verifyResetPasswordToken = async (request, h) => {
    const log = logger.start('users:api:verifyResetPasswordToken')

    try {
        await service.verifyResetPasswordToken(request.query.token)
        log.end()
        return h.file(path.join(__dirname, '../../../templates/user-update-password.html'))
    } catch (err) {
        log.error(err)
        log.end()
        return h.file(path.join(__dirname, '../../../templates/user-verify-password-failure.html'))
    }
}

const logout = async (request, h) => {
    const log = logger.start('users:api:logout')

    try {

        const message = await service.logout(request.userInfo._id)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const getEmail = async (request, h) => {
    const log = logger.start('users:api:getEmail')

    try {


        const message = await service.getEmail(request.userInfo._id)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const changePassword = async (request, h) => {
    console.log('inside the changepassword');
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.changePassword(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const setNewPassword = async (request, h) => {
    const log = logger.start('user:api:changeEmail')
    try {
        const message = await service.setNewPassword(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const employerProfileStep1 = async (request, h) => {
    const log = logger.start('user:api:employerProfileStep1')
    try {
        request.payload.userId = request.userInfo._id
        // request.payload.profileStepCompleted= 1
        log.info(request.payload)
        const message = await service.employerProfileStep1(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const employerProfileStep2 = async (request, h) => {
    console.log('employerProfileStep2=============>')
    const log = logger.start('user:api:employerProfileStep2')
    try {
        request.payload.userId = request.userInfo._id
        //request.payload.profileStepCompleted= 2
        const message = await service.employerProfileStep2(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const employeeProfileStep1 = async (request, h) => {
    const log = logger.start('user:api:employeeProfileStep1')
    try {

        request.payload.userId = request.userInfo._id
        request.payload.profileStepCompleted = 1

        const message = await service.employeeProfileStep1(request.payload)
        console.log('message=====>>>',message)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const employeeProfileStep2 = async (request, h) => {
    const log = logger.start('user:api:employeeProfileStep2')
    try {
        request.payload.userId = request.userInfo._id
        request.payload.profileStepCompleted = 2

        const message = await service.employeeProfileStep2(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const employeeProfileStep3 = async (request, h) => {
    const log = logger.start('user:api:employeeProfileStep3')
    try {
        request.payload.userId = request.userInfo._id
        request.payload.profileStepCompleted = 3

        const message = await service.employeeProfileStep3(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const employeeProfileStep4 = async (request, h) => {
    const log = logger.start('user:api:employeeProfileStep4')
    try {
    
        request.payload.userId = request.userInfo._id
        // request.payload.profileStepCompleted= 4 
        // request.payload.document

        const message = await service.employeeProfileStep4(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const deleteEmployeeProfileStep2 = async (request, h) => {
    const log = logger.start('user:api:deleteEmployeeProfileStep2')
    try {
        request.payload.userId = request.userInfo._id
        request.payload.profileStepCompleted = 2

        const message = await service.deleteEmployeeProfileStep2(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const deleteEmployeeProfileStep3 = async (request, h) => {
    const log = logger.start('user:api:deleteEmployeeProfileStep3')
    try {
        request.payload.userId = request.userInfo._id
        request.payload.profileStepCompleted = 3

        const message = await service.deleteEmployeeProfileStep3(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const deleteEmployeeProfileStep4 = async (request, h) => {
    const log = logger.start('user:api:deleteEmployeeProfileStep4')
    try {
        request.payload.userId = request.userInfo._id
        // request.payload.profileStepCompleted= 4 
        // request.payload.document

        const message = await service.deleteEmployeeProfileStep4(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const companyProfile = async (request, h) => {
    const log = logger.start('user:api:companyProfile')
    try {
        request.query.userData = request.userInfo
        request.query.userId = request.userInfo._id
        const message = await service.companyProfile(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const skipStep = async (request, h) => {
    const log = logger.start('user:api:skipStep')
    try {
        request.payload.userId = request.userInfo._id
        request.payload.Stepskipped
        const message = await service.skipStep(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const stepCompleted = async (request, h) => {
    const log = logger.start('user:api:stepCompleted')
    try {
        request.payload.userId = request.userInfo._id
        //request.payload.Stepskipped
        const message = await service.stepCompleted(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}





const userProfile = async (request, h) => {
    const log = logger.start('user:api:userProfile')
    try {
        request.query.userId = request.userInfo._id
        const message = await service.userProfile(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const accountPrivacy = async (request, h) => {
    const log = logger.start('user:api:accountPrivacy')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.accountPrivacy(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const followUnfollowCompany = async (request, h) => {
    const log = logger.start('user:api:followUnfollowCompany')
    try {
        request.payload.userId = request.userInfo._id
        request.payload.userData = request.userInfo;
        const message = await service.followUnfollowCompany(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const review = async (request, h) => {
    const log = logger.start('user:api:review')
    try {
        request.payload.userId = request.userInfo._id

        const message = await service.review(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const myPva = async (request, h) => {
    const log = logger.start('user:api:myPva')
    try {
        const message = await service.myPva(request)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

// const savedJobs = async (request, h) => {
//     const log = logger.start('user:api:savedJobs')
//     try {
//         request.payload.userId = request.userInfo._id
//         const message = await service.savedJobs(request.payload)
//         log.end()
//         return response.success(h, message)
//     } catch (err) {
//         log.error(err)
//         log.end()
//         return response.failure(h, err.message)
//     }
// }

const blockUser = async (request, h) => {
    const log = logger.start('user:api:blockUser')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.blockUser(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const unblockUser = async (request, h) => {
    const log = logger.start('user:api:unblockUser')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.unblockUser(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const sendConnectionRequest = async (request, h) => {
    const log = logger.start('user:api:sendConnectionRequest')
    try {
        request.payload.userId = request.userInfo._id
        request.payload.toContactId
        const message = await service.sendConnectionRequest(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const acceptConnectionRequest = async (request, h) => {
    const log = logger.start('user:api:acceptConnectionRequest')
    try {
        request.payload.userId = request.userInfo._id
        request.payload.userInfo = request.userInfo;
        // request.payload.toContactId
        const message = await service.acceptConnectionRequest(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const showConnectionRequest = async (request, h) => {
    const log = logger.start('user:api:showConnectionRequest')
    try {
        request.query.userId = request.userInfo._id
        const message = await service.showConnectionRequest(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const rejectConnectionRequest = async (request, h) => {
    const log = logger.start('user:api:rejectConnectionRequest')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.rejectConnectionRequest(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const saveJobs = async (request, h) => {
    const log = logger.start('user:api:saveJobs')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.saveJobs(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}





const followingJobs = async (request, h) => {
    const log = logger.start('user:api:followingJobs')
    try {
        request.query.userId = request.userInfo._id
        const message = await service.followingJobs(request)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}




const viewSavedJobs = async (request, h) => {
    const log = logger.start('user:api:viewSavedJobs')
    try {
        const message = await service.viewSavedJobs(request)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const inviteForJob = async (request, h) => {
    const log = logger.start('user:api:inviteForJob')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.inviteForJob(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

// const acceptInvite = async (request, h) => {
//     const log = logger.start('user:api:acceptInvite')
//     try {
//         request.payload.userId=request.userInfo._id
//         const message = await service.acceptInvite(request.payload)
//         log.end()
//         return response.success(h, message)
//     } catch (err) {
//         log.error(err)
//         log.end()
//         return response.failure(h, err.message)
//     }
// }



const applyForJob = async (request, h) => {
    const log = logger.start('user:api:applyForJob')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.applyForJob(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const acceptRejectCandidate = async (request, h) => {
    const log = logger.start('user:api:acceptRejectCandidate')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.acceptRejectCandidate(request)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}
const acceptRejectFromCandidate = async (request, h) => {
    const log = logger.start('user:api:acceptRejectCandidate')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.acceptRejectFromCandidate(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const scheduleInterview = async (request, h) => {
    const log = logger.start('user:api:scheduleInterview')
    try {
        request.payload.userId = request.userInfo._id;
        request.payload.userInfo = request.userInfo;
        const message = await service.scheduleInterview(request.payload.userId,request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const referJobs = async (request, h) => {
    const log = logger.start('user:api:referJobs')
    try {
        request.payload.userId = request.userInfo._id
        request.payload.userInfo = request.userInfo;
        const message = await service.referJobs(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const selectInterviewTime = async (request, h) => {
    const log = logger.start('user:api:selectInterviewTime')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.selectInterviewTime(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const hireRejectCandidate = async (request, h) => {
    const log = logger.start('user:api:hireRejectCandidate')
    try {
        request.payload.userId = request.userInfo._id;
        request.payload.userInfo = request.userInfo;
        const message = await service.hireRejectCandidate(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const viewReferredJobs = async (request, h) => {
    const log = logger.start('users:api:viewReferredJobs')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.viewReferredJobs(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const viewAssociateConnected = async (request, h) => {
    const log = logger.start('users:api:viewAssociateConnected')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.viewAssociateConnected(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const viewAppliedJobs = async (request, h) => {
    const log = logger.start('users:api:viewAppliedJobs')
    try {
        request.query.userId = request.userInfo._id
        const message = await service.viewAppliedJobs(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const viewInterviewingRequests = async (request, h) => {
    const log = logger.start('users:api:viewInterviewingRequests')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.viewInterviewingRequests(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const viewInterviewing = async (request, h) => {
    const log = logger.start('users:api:viewInterviewing')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.viewInterviewing(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const viewOfferedJobs = async (request, h) => {
    const log = logger.start('users:api:viewOfferedJobs')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.viewOfferedJobs(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const withdrawApplication = async (request, h) => {
    const log = logger.start('users:api:withdrawApplication')

    try { 
        request.payload.userId = request.userInfo._id
        const message = await service.withdrawApplication(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const viewCompanyJobs = async (request, h) => {
    const log = logger.start('users:api:viewCompanyJobs')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.viewCompanyJobs(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const viewBlockedUsers = async (request, h) => {
    const log = logger.start('users:api:viewBlockedUsers')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.viewBlockedUsers(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const searchCompanies = async (request, h) => {
    const log = logger.start('users:api:searchCompanies')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.searchCompanies(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const searchAssociates = async (request, h) => {
    const log = logger.start('users:api:searchAssociates')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.searchAssociates(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const companyList = async (request, h) => {
    const log = logger.start('users:api:companyList')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.companyList(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const associateList = async (request, h) => {
    const log = logger.start('users:api:associateList')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.associateList(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}




const fetchFeaturedCandidate = async (request, h) => {
    const log = logger.start('users:api:fetchFeaturedCandidate')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.fetchFeaturedCandidate(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const changeWorkingStatus = async (request, h) => {
    const log = logger.start('users:api:changeWorkingStatus')

    try {
        request.payload.userId = request.userInfo._id
        const message = await service.changeWorkingStatus(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const candidateStats = async (request, h) => {
    const log = logger.start('users:api:candidateStats')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.candidateStats(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const employerJobStats = async (request, h) => {
    const log = logger.start('users:api:candidateStats')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.employerJobStats(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const reportUser = async (request, h) => {
    const log = logger.start('users:api:reportUser')

    try {
        request.payload.userId = request.userInfo._id
        const message = await service.reportUser(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const userExperience = async (request, h) => {
    const log = logger.start('users:api:userExperience')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.userExperience(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const searchEmployee = async (request, h) => {
    const log = logger.start('users:api:searchEmployee')

    try {
        request.payload.userId = request.userInfo._id
        const message = await service.searchEmployee(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}




const searchEmployeeFilter = async (request, h) => {
    const log = logger.start('users:api:searchEmployeeFilter')

    try {
        request.payload.userId = request.userInfo._id
        const message = await service.searchEmployeeFilter(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const reviewEmployee = async (request, h) => {
    const log = logger.start('users:api:reviewEmployee')

    try {
        request.payload.userId = request.userInfo._id;
        request.payload.userInfo = request.userInfo;
        const message = await service.reviewEmployee(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const fetchRecommendedEmployees = async (request, h) => {
    const log = logger.start('users:api:fetchRecommendedEmployees')

    try {
        request.payload.userId = request.userInfo._id
        const message = await service.fetchRecommendedEmployees(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const inviteRecommendedEmployees = async (request, h) => {
    const log = logger.start('users:api:inviteRecommendedEmployees')

    try {
        request.payload.userId = request.userInfo._id;
        request.payload.userInfo = request.userInfo;
        const message = await service.inviteRecommendedEmployees(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const contactUs = async (request, h) => {
    const log = logger.start('users:api:contactUs')

    try {
        //request.payload.userId = request.userInfo._id
        const message = await service.contactUs(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const registrationappUs = async (request, h) => {
    const log = logger.start('users:api:registrationappUs')

    try {
        //request.payload.userId = request.userInfo._id
        const message = await service.registrationappUs(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const viewInvitedJobs = async (request, h) => {
    const log = logger.start('users:api:viewInvitedJobs')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.viewInvitedJobs(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const searchFeaturedCandidate = async (request, h) => {
    const log = logger.start('users:api:searchFeaturedCandidate')

    try {
        request.payload.userId = request.userInfo._id
        const message = await service.searchFeaturedCandidate(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const filterFeaturedCandidate = async (request, h) => {
    const log = logger.start('users:api:filterFeaturedCandidate')

    try {
        request.payload.userId = request.userInfo._id
        const message = await service.filterFeaturedCandidate(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const selfProfile = async (request, h) => {
    const log = logger.start('users:api:selfProfile')

    try {
        
        request.query.userId = request.userInfo._id
        const message = await service.selfProfile(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}
const availableCreditslist = async (request, h) => {
    const log = logger.start('users:api:availableCreditslist')

    try {
        
        request.query.userId = request.userInfo._id
        const message = await service.availableCreditslist(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const fetchCompanyReviews = async (request, h) => {
    const log = logger.start('users:api:fetchCompanyReviews')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.fetchCompanyReviews(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const creditDeductionEmployerProfile = async (request, h) => {
    const log = logger.start('users:api:creditDeductionEmployerProfile')

    try {
        request.payload.userId = request.userInfo._id
        const message = await service.creditDeductionEmployerProfile(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const updateEmployerProfileStep1 = async (request, h) => {
    const log = logger.start('users:api:updateEmployerProfileStep1')

    try {
        request.payload.userId = request.userInfo._id
        const message = await service.updateEmployerProfileStep1(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}
const updateEmployerProfileStep2 = async (request, h) => {
    const log = logger.start('users:api:updateEmployerProfileStep2')

    try {
        request.payload.userId = request.userInfo._id
        const message = await service.updateEmployerProfileStep2(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const changeEmail = async (request, h) => {
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.changeEmail(request.payload)
        return response.success(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}

const cancelInterview = async (request, h) => {
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.cancelInterview(request.payload)
        return response.success(h, message)
    } catch (err) {
        return response.failure(h, err.message)
    }
}

const socialLoginSignUp = async (request, h) => {
    try {
        if (!request.payload.googleLoginId && !request.payload.facebookLoginId && !request.payload.linkedInLoginId) {
            throw new Error("Please enter either one id")
        }

        const user = await service.socialLoginSignUp(request.payload)
        return response.success(h, mapper.toModel(user), user.token).header('x-logintoken', user.token)

    } catch (err) {
        return response.failure(h, err.message)
    }
}



const deleteAccount = async (request, h) => {
  

    const log = logger.start('users:api:deleteAccount')
    try {
        request.query.userId = request.userInfo._id
        const message = await service.deleteAccount(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const UpdatePvaName = async (request, h) => {
     const log = logger.start('users:api:UpdatePvaName')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.UpdatePvaName(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
  
} 

const CheckingEmployeracces = async (request, h) => {
    const log = logger.start('users:api:CheckingEmployeracces')
    try {
        request.payload.userId = request.userInfo._id
        const message = await service.CheckingEmployeracces(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
} 

const CheckingPVAnotification = async (request, h) => {
    const log = logger.start('users:api:CheckingPVAnotification')
    try {
        request.query.userId = request.userInfo._id
       const message = await service.CheckingPVAnotification(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
} 




exports.socialLoginSignUp = socialLoginSignUp
exports.signUp = signUp
exports.checkEmailExists = checkEmailExists
exports.login = login
exports.verifyEmail = verifyEmail
exports.logout = logout
exports.getEmail = getEmail
exports.setNewPassword = setNewPassword
exports.resetPasswordToken = resetPasswordToken
exports.verifyResetPasswordToken = verifyResetPasswordToken
exports.forgotPassword = forgotPassword
exports.changePassword = changePassword
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
exports.acceptRejectCandidate = acceptRejectCandidate
exports.acceptRejectFromCandidate = acceptRejectFromCandidate
exports.stepCompleted = stepCompleted
exports.scheduleInterview = scheduleInterview
exports.referJobs = referJobs
exports.selectInterviewTime = selectInterviewTime
exports.hireRejectCandidate = hireRejectCandidate
exports.viewOfferedJobs = viewOfferedJobs
exports.viewReferredJobs = viewReferredJobs
exports.viewInterviewing = viewInterviewing
exports.viewAssociateConnected = viewAssociateConnected
exports.viewInterviewingRequests = viewInterviewingRequests
exports.viewAppliedJobs = viewAppliedJobs
exports.withdrawApplication = withdrawApplication
exports.viewCompanyJobs = viewCompanyJobs
exports.viewBlockedUsers = viewBlockedUsers
exports.searchCompanies = searchCompanies
exports.searchAssociates = searchAssociates
exports.companyList = companyList
exports.associateList = associateList
exports.searchCompanies = searchCompanies
exports.fetchFeaturedCandidate = fetchFeaturedCandidate
exports.changeWorkingStatus = changeWorkingStatus
exports.candidateStats = candidateStats
exports.employerJobStats = employerJobStats
exports.reportUser = reportUser
exports.userExperience = userExperience
exports.searchEmployee = searchEmployee
exports.reviewEmployee = reviewEmployee
exports.searchEmployeeFilter = searchEmployeeFilter
exports.fetchRecommendedEmployees = fetchRecommendedEmployees
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
exports.updateEmployerProfileStep1 = updateEmployerProfileStep1
exports.updateEmployerProfileStep2 = updateEmployerProfileStep2
exports.changeEmail = changeEmail
exports.cancelInterview = cancelInterview
exports.deleteAccount = deleteAccount
exports.UpdatePvaName = UpdatePvaName
exports.CheckingEmployeracces = CheckingEmployeracces
exports.CheckingPVAnotification = CheckingPVAnotification