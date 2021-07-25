'use strict'
const Joi = require('joi')

module.exports = {
    signUp: {
        payload: {
            loginType: Joi.number().required().valid(1, 2, 3, 4).description("1 for normal signUp, 2 for facebOok, 3 for google,4 for linkedIn"),
            fullName: Joi.string().trim().allow("").description("full name"),
            // registrationkey: Joi.string().trim().allow("").description("registration key"),
            userRole: Joi.string().required().default("employer").valid(["employee", "employer", "admin"]).trim(),
            email: Joi.string().email().required().description('Valid email Id'),
            password: Joi.string().when('loginType', {
                is: 1,
                then: Joi.string().required().trim().regex(/^(?=.*?[a-zA-Z])(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,15}$/).options({ language: { string: { regex: { base: '\nPassword must be between 6-15 characters including a number and a special character.' } } } }).label('Incorrect password format.').required().description('Password:MinLength:6'),
                otherwise: Joi.string().optional().allow('').label('Password')
            }), //Joi.string().regex(/^(?=.*?[a-zA-Z])(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,15}$/).options({ language: { string: { regex: { base: 'must be between 6-15 characters including a number and a special character.is invalid' } } } }).label('Password').required().description('Password:MinLength:6'),

            offerCode: Joi.string().optional().allow('').label('offerCode'),
            creditType: Joi.number().optional().valid(0,1).description('0 for normal signup, 1 for signup with offer code'),

            socialId: Joi.string().trim().when('loginType', {
                is: 1,
                then: Joi.optional().allow(''),
                otherwise: Joi.required()
            }).label('Social login(facebook/google-plus) id'),

            timeZone: Joi.string().required().default("Asia/Kolkata")
        }
    },
    login: {
        payload: {
            userRole: Joi.string().required().default("employer").valid(["employee", "employer", "admin"]).trim(),
            email: Joi.string().email().required().trim().description('Email'),
            password: Joi.string().required(),
            timeZone: Joi.string().required().default("Asia/Kolkata"),
            fcmToken:Joi.string().optional().description("fcmToken")
        }
    },
    employeesContactLead:{
        payload:{
            name:Joi.string().required(),
            email: Joi.string().email().required().trim().description('Email'),
            tellus: Joi.string().required().trim().description('tellus'),
            description: Joi.optional().allow(''),
            contactNumber1: Joi.number().optional().allow(0).description('Company Number'),
            contactnumber: Joi.number().optional().allow(0).description('Company Number'),
        }
    },
    employersContactLead:{
        payload:{
            Empname:Joi.string().required(),
            Empemail: Joi.string().email().required().trim().description('Email'),
            tellus: Joi.string().required().trim().description('tellus'),
            description: Joi.optional().allow(''),
            contactNumber1: Joi.number().optional().allow(0).description('Company Number'),
            contactnumber: Joi.number().optional().allow(0).description('Company Number'),
        }
    },
    socialLoginSignUp: {
        payload: {
            userRole: Joi.string().required().default("employer").valid(["employee", "employer"]).trim(),
            email: Joi.string().required(),
            googleLoginId: Joi.string().allow(""),
            facebookLoginId: Joi.string().allow(""),
            linkedInLoginId: Joi.string().allow(""),
            timeZone: Joi.string().required().default("Asia/Kolkata")

        }
    },
    verifyEmail: {
        query: {
            token: Joi.string().required()
        }
    },

    checkEmailExists: {
        payload: {
            email: Joi.string().email().required().trim().description('Email'),
        }
    },

    resendEmailVerificationLink: {
        payload: {
            email: Joi.string().email().required().trim().description('Email')
        }
    },
    setNewPassword: {
        payload: {
            resetPasswordToken: Joi.string().required(),
            password: Joi.string().regex(/^(?=.*?[a-zA-Z])(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,15}$/).options({ language: { string: { regex: { base: 'must be between 6-15 characters including a number and a special character.is invalid' } } } }).label('Password').required().description('Password:MinLength:6'),
        }
    },
    forgot: {
        payload: {
            email: Joi.string().email().required().trim().description('Email')
        }
    },
    changePassword: {
        payload: {
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().regex(/^(?=.*?[a-zA-Z])(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,15}$/).options({ language: { string: { regex: { base: 'must be between 6-15 characters including a number and a special character.is invalid' } } } }).label('Password').required().description('Password:MinLength:6'),
        }
    },
    verifyResetPasswordToken: {
        query: {
            token: Joi.string().required()
        }
    },
    employerProfileStep1: {
        payload: {

            fullName: Joi.string().optional().trim().description('Company Name'),
            industryTypeId: Joi.string().optional().allow("").description('Industry Type'),
            registrationNumber: Joi.string().optional().allow("").description('Industry Type'),
            description: Joi.string().optional().allow("").description('Discription of company'),
            address: Joi.object().keys({
                fullAddress: Joi.string().optional().allow(""),
                city: Joi.string().optional().trim(),
                pincode: Joi.string().optional().trim()
            }).optional().label('address'),
            location: Joi.object().keys({
                geoType: Joi.string().optional().allow('').default("point"),
                coordinates: Joi.array().optional().allow('')
            }),
            companyVideo: Joi.string().optional().allow("").description('Id of company video uploaded earlier'),
            isCommercialVideo: Joi.boolean().default(false).description("if the video is commercial or not"),
            serviceId: Joi.array().optional().allow(""),
            companyLogo: Joi.string().optional().allow("").description('_Id of logo'),
            isUpdate: Joi.boolean().default(false)
        }

    },
    employerProfileStep2: {
        payload: {
            contactPerson: Joi.object().keys({
                name: Joi.string().optional().trim().description('Company Name'),
                position: Joi.string().optional().allow("").description('Company Name'),
                contactNumber: Joi.number().optional().allow(0).description('Company Name'),
                emailId: Joi.string().optional().email().description('Company Name')
            }).optional().label("contact person")
        }
    }

    ,
    employeeProfileStep1: { //general information
        payload: {
            profilePicId: Joi.string().required().trim().description("Please upload profile photo"),
            fullName: Joi.string().required().trim().description('employee Name'),
            address: Joi.object().keys({
                fullAddress: Joi.string().required().trim(),
                city: Joi.string().required().trim(),
                pincode: Joi.string().required().allow("")
            }).required().label('address'),
            location: Joi.object().keys({
                type: Joi.string().required().trim().default("point"),
                coordinates: Joi.array().required()
            }),
            industryTypeId: Joi.string().allow("").trim().description('Industry Type preferred by employee'),
            contactNumber: Joi.number().required().description('employee contact no'),
            currentPositionName: Joi.string().allow("").optional().lowercase(),
            currentPositionId: Joi.string().allow("").description('employee current position'),
            gender: Joi.string().trim().required().description('male/female/other'),
            skills: Joi.array().allow("").description('employee skills id'),
            languageId: Joi.array().allow("").description('language id of language employee knows'),
            disability: Joi.object().keys({
                description: Joi.string().optional().allow("").trim().description('employee disablity description'),
                disabilityStatus: Joi.number().optional().allow("").description('employee disability status 1 if he is disable 0 if he is not disabled')
            }).required().label("disablity of employee"),
            dob: Joi.number().required().description('employee date of birth(timestamp)'),
            // email:Joi.string().email().required().description('Valid email Id')

        }
    },
    employeeProfileStep2: { //educational information
        payload: {
            _id: Joi.string().optional().allow(""),
            qualification: Joi.object().keys({
                degree: Joi.string().required().trim().description("degree"),
                institution: Joi.string().required().trim().description("institution"),
                from: Joi.number().description("course start date"),
                to: Joi.number().description("course end date"),
            }).required().label('qualifications')

        }
    },
    employeeProfileStep3: { //employment information
        payload: {
            _id: Joi.string().optional().allow(""),
            employmentInfo: Joi.object().keys({
                companyName: Joi.string().required().trim().description("company name"),
                from: Joi.number().description("from"),
                to: Joi.number().description("to"),
                jobTitle: Joi.string().required().trim().description("jobTitle"),

            }).required().label('employment info')


        }

    },
    employeeProfileStep4: { // document
        payload: {
            // document:Joi.array().items(Joi.object().keys({                           //.object().keys({
            pvrId: Joi.string().optional().description("pvr id"),
            certificateId: Joi.array().optional().allow("").description("certificate Id"),
            bio: Joi.string().optional().allow("").description("bio or self description by the candidate"),
            cvId: Joi.string().optional().allow("").description("cvId by the candidate"),
            // }).allow("").label("document uploading")
            //}
            // )}
        }
    },
    deleteEmployeeProfileStep2: { //educational information
        payload: {
            _id: Joi.string().optional()
        }
    },
    deleteEmployeeProfileStep3: { //employment information
        payload: {
            _id: Joi.string().optional()
        }

    },
    deleteEmployeeProfileStep4: { // document
        payload: {
            pvrId: Joi.string().optional().allow("").description("pvr id"),
            cvId: Joi.string().optional().allow("").description("cv id"),
            certificateId: Joi.string().allow("").optional().description("certificate Id")
        }
    },
    // deleteAccount: { // document
    //     payload: {
    //         _id: Joi.string().optional()
    //         // _id:Joi.string().trim().description("the user id is _id of the user whose profile is to be updated"),
    //     }
    // },
    deleteAccount: {
        query: {

        }
    }, 

    UpdatePvaName: {
        payload: {
            _pvaid: Joi.string().trim().required().description("Pva Object id"),
            pva_id: Joi.string().optional().description("id"),
            pva_name: Joi.string().trim().required().description("Pva Object id")
        }
    }, 

    CheckingEmployeracces: {
        payload: {
            empId: Joi.string().trim().required().description("employee  id"),
            view_type: Joi.string().trim().required().description("view type  id"),
        }
    },
    CheckingPVAnotification: {
        query: {
           
        }
    }, 
     

    searchCompanies: {
        query: {
            name: Joi.string().trim().description("the name of the companies").optional().allow(""),
            skip: Joi.number().required().description("for paginations, no of records to skip"),
            limit: Joi.number().required().description("the no of records to show first")
        }
    },
    searchAssociates: {
        query: {
            name: Joi.string().trim().description("the name of the associate to be searched").optional().allow(""),
            skip: Joi.number().required().description("for paginations, no of records to skip"),
            limit: Joi.number().required().description("the no of records to show first")
        }
    },
    companyList: {
        query: {
            skip: Joi.number().required().description("for paginations, no of records to skip"),
            limit: Joi.number().required().description("the no of records to show first")
        }
    },
    companyProfile: {
        query: {
            companyId: Joi.string().required().trim().description("id of the company that is being unfollowecd")
        }
    },
    skipStep: {
        payload: {
            stepNumber: Joi.number().required().description("the step number of profile to be skipped")
        }
    },
    stepCompleted: {
        payload: {
            step: Joi.number().required().description("the step number of profile which is completed")
        }
    },
    userProfile: {
        query: {
            associateId: Joi.string().required().description("associateId is id of  user whose profile we want to see based on account privacy")
        }
    },
    accountPrivacy: {
        payload: {
            accountPrivacyStatus: Joi.number().required().description("1 for showing all info 2 for showing less info")
        }
    },
    followUnfollowCompany: {
        payload: {
            companyId: Joi.string().required().description("id of the comapny which is to be followed or unfollowed"),
            followingStatus: Joi.number().required().description("send 1 if he wants to follow company send 2 if he wants to unfollow company")
        }
    },
    review: {
        payload: {
                from: Joi.string().trim().required().description("the user who is giving the rating"),
                toUser: Joi.string().required().trim().description("who is receiving the rating and review"),
                reviewDetail: Joi.string().trim().optional().description("the detailed review"),
                ratingGiven: Joi.number().min(0).max(5).required().description("rating in numbers"),
                reviewTime: Joi.number().required().description("the time of posting the job")
        }
    },
    viewBlockedUsers: {
        query: {
            skip: Joi.number().required().description("for paginations, no of records to skip"),
            limit: Joi.number().required().description("the no of records to show first")
        }
    },
    blockUser: {
        payload: {
            contactId: Joi.string().trim().required().description(" the id of the user to be blocked")

        }
    },
    unblockUser: {
        payload: {
            contactId: Joi.string().trim().required().description(" the id of the job the user has applied to")

        }
    },
    sendConnectionRequest: {
        payload: {
            toContactId: Joi.string().trim().required().description("to id of the contact to make connection"),
        }
    },
    acceptConnectionRequest: {
        payload: {
            contactId: Joi.string().required().description("the contact id of the associate whose request is to be accepted")

        }
    },
    rejectConnectionRequest: {
        payload: {
            contactId: Joi.string().required().description("the contact id of the associate whose request is to be rejected")

        }
    },
    searchEmployee: {
        payload: {
            jobTitle: Joi.string().optional().allow("").description("the job title for which the candidate is being searched"),
            skills: Joi.array().optional().allow("").description("the skills required for the job"),
            pincode: Joi.string().optional().allow("").description("the pincode for searching")

        }
    },
    saveJobs: {
        payload: {
            jobId: Joi.string().trim().required().description("the id of the job to be saved"),
            saveJobStatus: Joi.string().trim().required().description("send true if want to save job, and false if want to remove it")
        }
    },
    inviteForJob: {
        payload: {
            candidateId: Joi.string().trim().required().description("the id of the candidate to be invited to job"),
            jobId: Joi.string().trim().required().description("the id of the job to which the candidate is being invited")
        }
    },
    acceptRejectCandidate: {
        payload: {
            candidateId: Joi.string().trim().required().description("the candidate whose application for job is to be accepted or rejected"),
            jobId: Joi.string().trim().required().description("id of the job"),
            accepted: Joi.number().required().description("send 1 if candidiate is accepted, send 0 if rejected")
        }
    },
    acceptRejectFromCandidate: {
        payload: {
            candidateId: Joi.string().trim().required().description("the candidate whose application for job is to be accepted or rejected"),
            jobId: Joi.string().trim().required().description("id of the job"),
            accepted: Joi.number().required().description("send 1 if candidiate is accepted, send 0 if rejected")
        }
    },
    scheduleInterview: {
        payload: {
            candidateId: Joi.string().trim().required().description("the candidate id"),
            jobId: Joi.string().trim().required().description("the id of the job to which candidate has applied"),
            slot1: Joi.number().required().description("the time slot for interview"),
            slot2: Joi.number().required().description("the time slot for interview"),
            slot3: Joi.number().required().description("the time slot for interview"),

        }
    },
    hireRejectCandidate: {
        payload: {
            jobId: Joi.string().required().trim().description("the job id for which candidate has applied to"),
            candidateId: Joi.string().trim().description("the id of the candidate"),
            hiringStatus: Joi.number().required().description("send 1 if candidate is hired and as 0 if candidate is rejected")
        }
    },
    referJobs: {
        payload: {
            jobId: Joi.string().trim().required().description("the job id to be shared"),
            associateId: Joi.array().required().description("the associate id to whom job is being shared"),
        }
    },
    viewReferredJobs: {
        query: {}
    },
    viewAssociateConnected: {
        query: {}
    },
    viewAppliedJobs: {
        query: {}
    },
    viewInterviewingRequests: {
        query: {}
    },
    viewInterviewing: {
        query: {}
    },
    viewOfferedJobs: {
        query: {}
    },
    changeWorkingStatus: {
        payload: {
            isWorking: Joi.string().description("send true if curently working and false if open to opportunities")
        }
    },
    fetchFeaturedCandidate: {
        query: {
            skip: Joi.number().optional().allow().description("for paginations, no of records to skip"),
            limit: Joi.number().optional().allow().description("the no of records to show first")
        }
    },
    associateList: {
        query: {
            fetchConnected: Joi.boolean().optional(),
            skip: Joi.number().required().description("for paginations, no of records to skip"),
            limit: Joi.number().required().description("the no of records to show first")
        }
    }

    ,
    followingJobs: {
        query: {
            skip: Joi.number().required().description("for paginations, no of records to skip"),
            limit: Joi.number().required().description("the no of records to show first")

        }
    },
    viewCompanyJobs: {
        query: {
            companyId: Joi.string().trim().description("the company id"),
            skip: Joi.number().required().description("for paginations, no of records to skip"),
            limit: Joi.number().required().description("the no of records to show first")

        }
    },

    selectInterviewTime: {
        payload: {
            candidateId: Joi.string().optional().allow("").default(""),
            jobId: Joi.string().trim().required().description("the job id to which candidate has already applied"),
            interviewTime: Joi.number().required().description("the selected time")

        }
    },
    reportUser: {
        payload: {
            employeeId: Joi.string().trim().required().description("the id of the candidate to be reported"),
            reportReason: Joi.string().trim().optional().allow("").description("mention the reason for reporting the user")
        }
    },
    reportUser: {
        payload: {
            employeeId: Joi.string().trim().required().description("the id of the candidate to be reported"),
            reportReason: Joi.string().trim().optional().allow("").description("mention the reason for reporting the user")
        }
    },
    reviewEmployee: {
        payload: {

            review: Joi.object().keys({
                from: Joi.string().trim().required().description("the user who is giving the rating"),
                toUser: Joi.string().required().trim().description("who is receiving the rating and review"),
                reviewDetail: Joi.string().trim().description("the detailed review"),
                ratingGiven: Joi.number().required().description("rating in numbers"),
                reviewTime: Joi.number().required().description("the time of posting the job")

            }).label(" for review")

        }
    },
    inviteRecommendedEmployees: {
        payload: {
            candidateId: Joi.array().required().description("the id of the candidate to be invited to job"),
            jobId: Joi.string().trim().required().description("the id of the job to which the candidate is being invited")
        }
    },
    fetchRecommendedEmployees: {
        payload: {
            jobId: Joi.string().trim().description("the job id for which the recommended candidates list need to be fetched")
        }
    },
    contactUs: {
        payload: {
            fullName: Joi.string().trim().description("the full name of person"),
            email: Joi.string().email().description("the email id on which user can be reached"),
            contactNumber: Joi.number().description("the no on which user can be contacted"),
            message: Joi.string().description("message containing reason for contact"),
        }
    },
    registrationappUs: {
        payload: {
            fullName: Joi.string().trim().description("the full name of person"),
            name: Joi.string().trim().description("the  name of person"),
            email: Joi.string().email().description("the email id on which user can be reached"),
            contactNumber: Joi.number().description("the no on which user can be contacted"),
            Empname:Joi.string().optional().allow(''),
            Empemail: Joi.string().email().optional().allow('').description('Email'),
            tellus: Joi.string().required().trim().description('tellus'),
            description: Joi.optional().allow(''),
            type: Joi.string(),
            contactNumber1: Joi.number().optional().allow(0).description('Company Number'),
            contactnumber: Joi.number().optional().allow(0).description('Company Number'),
            
        }
    },
    searchEmployeeFilter: {
        payload: {
            expLowerLimit: Joi.number().allow("").optional().description("the experience lower limit"),
            expUpperLimit: Joi.number().allow("").optional().description("the experience lower limit"),
            rating: Joi.number().allow("").optional().description("shela rating of the employee that posted job"),
            disablityStatus: Joi.number().optional().allow().description("for searching specially abled employees "),
            minDistance: Joi.number().allow().optional().description("max distsnce for finding location in miles"),
            maxDistance: Joi.number().allow().optional().description("max distsnce for finding location in miles"),

        }
    },
    viewInvitedJobs: {
        query: {}
    },
    searchFeaturedCandidate: {
        payload: {
            jobTitle: Joi.string().optional().allow("").description("the job title for which the candidate is being searched"),
            skills: Joi.array().optional().allow("").description("the skills required for the job"),
            pincode: Joi.string().optional().allow("").description("the pincode for searching")
        }

    },
    selfProfile: {
        query: {

        }
    },
    availableCreditslist:{
        query:{

        }
    },
    fetchCompanyReviews: {
        query: {}
    },
    fetchReviews: {
        query: {
            employerId:Joi.string().required().trim().description("the id of the employer whose review is being viewed"),
        }
    },
    filterFeaturedCandidate: {
        payload: {
            expLowerLimit: Joi.number().allow("").optional().description("the experience lower limit"),
            expUpperLimit: Joi.number().allow("").optional().description("the experience lower limit"),
            rating: Joi.number().allow("").optional().description("shela rating of the employee that posted job"),
            disablityStatus: Joi.number().optional().allow().description("for searching specially abled employees "),
            minDistance: Joi.number().allow().optional().description("max distsnce for finding location in miles").default(0),
            maxDistance: Joi.number().allow().optional().description("max distsnce for finding location in miles").default(0),
        }
    },
    creditDeductionEmployerProfile: {
        payload: {
            employeeId: Joi.string().trim().description("the id of the employee whose cv is being viewed"),
            cvCharges: Joi.number().description("send 1 if the cv charge is to be deducted and 0 if not"),
            pvaCharges: Joi.number().description("send 1 if the pva charge is to be deducted and 0 if not"),
            pvrCharges: Joi.number().description("send 1 if the pvr charge is to be deducted and 0 if not")

        }
    },

    updateEmployerProfileStep1: {
        payload: {
            //userId:Joi.string().trim().description("the user id is _id of the user whose profile is to be updated"),
            fullName: Joi.string().required().trim().description('Company Name'),
            industryTypeId: Joi.string().required().trim().description('Industry Type'),
            registrationNumber: Joi.string().required().trim().description('Industry Type'),
            description: Joi.string().required().trim().description('Discription of company'),
            address: Joi.object().keys({
                fullAddress: Joi.string().required().trim(),
                city: Joi.string().required().trim(),
                pincode: Joi.string().required().allow("")
            }).required().label('address'),
            location: Joi.object().keys({
                geoType: Joi.string().required().trim().default("point"),
                coordinates: Joi.array().required()
            }),
            companyVideo: Joi.string().optional().trim().description('Id of company video uploaded earlier'),
            isCommercialVideo: Joi.string().trim().description("if the video is commercial or not"),
            serviceId: Joi.array().required(),
            companyLogo: Joi.string().required().trim().description('_Id of logo'),

        }
    },
    updateEmployerProfileStep2: {
        payload: {

        }
    },
    changeEmail: {
        payload: {
            newEmail: Joi.string().email().description("the new email Id")
        }
    },
    cancelInterview: {
        payload: {
            candidateId: Joi.string().required(),
            jobId: Joi.string().required()
        }
    },
    // userExperience:{
    //     query:{

    //     }
    // }
    // ,

    // acceptInvite:{
    //     payload:{
    //         jobId:Joi.string().trim().required().description("the job id whose invitation is to be accepted")
    //     }
    // },
    applyForJob: {
        payload: {
            jobId: Joi.string().trim().required().description("the jobid of job the candidate is applying to"),
            applyingWithType: Joi.number().required().description("send 1 if user is applying with pvr, and send 2 if the user is applying with pva"),
            pvaId: Joi.string().trim().allow("").description("the pvaId of the user")
        }
    },
    withdrawApplication: {
        payload: {
            jobId: Joi.string().trim().required().description("the job id of the job candidate want to withdraw from")
        }
    },
    accessGranted: Joi.object({
        isSuccess: Joi.boolean(),
        status: Joi.string(),
        statusCode: Joi.number().default(200),
        data: Joi.object({
            id: Joi.string(),
            firstName: Joi.string(),
            lastName: Joi.string(),
            totalCredits: Joi.number(),
            availableCredits: Joi.number(),
            usedCredits:Joi.number(),
            email: Joi.string(),
            secondaryEmail: Joi.string(),
            role: Joi.number(),
            pic: Joi.string(),
            qualification: Joi.object({
                id: Joi.string(),
                name: Joi.string()
            }),
            accountPrivacyStatus: Joi.number().description("status of account privacy"),
            gender: Joi.string(),
            dob: Joi.date().default(new Date().toISOString()),
            address: Joi.object({
                street: Joi.string(),
                city: Joi.string(),
                state: Joi.string(),
                country: Joi.string()
            }),
            isCompleted: Joi.boolean(),
            isVerified: Joi.boolean(),
            isSuspended: Joi.boolean(),
            isDeleted: Joi.boolean(),
            createdAt: Joi.date().default(new Date().toISOString()),
            updatedAt: Joi.date().default(new Date().toISOString()),
            profileStepCompleted: Joi.array().description("profile step completed"),
            stepSkipped: Joi.array().description("profile step completed")
        })
    }),
    accessDenied: Joi.object({
        isSuccess: Joi.boolean().default(false),
        status: Joi.string(),
        statusCode: Joi.number().default(400),
        message: Joi.string()
    }),
    failure: Joi.object({
        isSuccess: Joi.boolean().default(false),
        status: Joi.string(),
        statusCode: Joi.number().default(320),
        message: Joi.string()
    }),
    success: Joi.object({
        isSuccess: Joi.boolean(),
        status: Joi.string(),
        statusCode: Joi.number().default(200),
        message: Joi.string()
    }),

    header: Joi.object({
        'x-logintoken': Joi.string().required().trim().description('Provide token to access api')
    }).unknown()
}
