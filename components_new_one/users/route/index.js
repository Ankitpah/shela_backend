/**
author : Simran
created_on : 12 Nov 2018
**/
'use strict'
const api = require('../api')
const specs = require('../specs')

module.exports = [{
        method: 'POST',
        path: '/api/users/signUp',
        options: specs.signUp,
        handler: api.signUp
    },
    {
        method: 'POST',
        path: '/api/users/login',
        options: specs.login,
        handler: api.login
    },
    {
        method: 'POST',
        path: '/api/users/socialLoginSignUp',
        options: specs.socialLoginSignUp,
        handler: api.socialLoginSignUp
    },
    {
        method: 'GET',
        path: '/api/users/email/verify',
        options: specs.verifyEmail,
        handler: api.verifyEmail
    }, {
        method: 'POST',
        path: '/api/users/checkEmailExists',
        options: specs.checkEmailExists,
        handler: api.checkEmailExists
    }, {
        method: 'POST',
        path: '/api/users/forgotPassword',
        options: specs.forgotPassword,
        handler: api.forgotPassword
    }, {
        method: 'GET',
        path: '/api/users/verifyResetPasswordToken',
        options: specs.verifyResetPasswordToken,
        handler: api.verifyResetPasswordToken
    }, {
        method: 'GET',
        path: '/api/users/resetPasswordToken',
        options: specs.resetPasswordToken,
        handler: api.resetPasswordToken
    }, {
        method: 'POST',
        path: '/api/users/setNewPassword',
        options: specs.setNewPassword,
        handler: api.setNewPassword
    }, {
        method: 'POST',
        path: '/api/users/resendEmailVerificationLink',
        options: specs.resendEmailVerificationLink,
        handler: api.resendEmailVerificationLink
    }, {
        method: 'POST',
        path: '/api/users/logout',
        options: specs.logout,
        handler: api.logout
    },
    {
        method: 'POST',
        path: '/api/users/changePassword',
        options: specs.changePassword,
        handler: api.changePassword
    },
    {
        method: 'POST',
        path: '/api/users/getEmail',
        options: specs.getEmail,
        handler: api.getEmail
    },
    // {
    //     method: 'POST',
    //     path: '/api/users/updateProfileStep1',
    //     options: specs.changePassword, //specs.updateProfileStep1,
    //     handler: api.changePassword //api.updateProfileStep1
    // },
    {
        method: 'POST',
        path: '/api/employer/employerProfileStep1',
        options: specs.employerProfileStep1,
        handler: api.employerProfileStep1
    },
    {
        method: 'POST',
        path: '/api/employee/employeeProfileStep1',
        options: specs.employeeProfileStep1,
        handler: api.employeeProfileStep1
    },
    {
        method: 'POST',
        path: '/api/employee/employeeProfileStep2',
        options: specs.employeeProfileStep2,
        handler: api.employeeProfileStep2
    }, {
        method: 'POST',
        path: '/api/employee/employeeProfileStep3',
        options: specs.employeeProfileStep3,
        handler: api.employeeProfileStep3
    }, {
        method: 'POST',
        path: '/api/employee/employeeProfileStep4',
        options: specs.employeeProfileStep4,
        handler: api.employeeProfileStep4
    },
    {
        method: 'POST',
        path: '/api/employee/deleteEmployeeProfileStep2',
        options: specs.deleteEmployeeProfileStep2,
        handler: api.deleteEmployeeProfileStep2
    }, 
    {
        method: 'POST',
        path: '/api/employee/deleteEmployeeProfileStep3',
        options: specs.deleteEmployeeProfileStep3,
        handler: api.deleteEmployeeProfileStep3
    }, 
    {
        method: 'POST',
        path: '/api/employee/deleteEmployeeProfileStep4',
        options: specs.deleteEmployeeProfileStep4,
        handler: api.deleteEmployeeProfileStep4
    }, 
    {
        method: 'POST',
        path: '/api/employer/employerProfileStep2',
        options: specs.employerProfileStep2,
        handler: api.employerProfileStep2
    }, {
        method: 'GET',
        path: '/api/employee/companyProfile',
        options: specs.companyProfile,
        handler: api.companyProfile
    },
    {
        method: 'POST',
        path: '/api/employee/skipStep',
        options: specs.skipStep,
        handler: api.skipStep
    },
    {
        method: 'POST',
        path: '/api/employee/stepCompleted',
        options: specs.stepCompleted,
        handler: api.stepCompleted
    },
    {
        method: 'GET',
        path: '/api/employee/userProfile',
        options: specs.userProfile,
        handler: api.userProfile
    },
    {
        method: 'POST',
        path: '/api/employee/accountPrivacy',
        options: specs.accountPrivacy,
        handler: api.accountPrivacy
    },
    {
        method: 'POST',
        path: '/api/employee/followUnfollowCompany',
        options: specs.followUnfollowCompany,
        handler: api.followUnfollowCompany
    },
    {
        method: 'POST',
        path: '/api/employee/review',
        options: specs.review,
        handler: api.review
    },

    {
        method: 'GET',
        path: '/api/employee/myPva',
        options: specs.myPva,
        handler: api.myPva
    },
    {
        method: 'POST',
        path: '/api/employee/blockUser',
        options: specs.blockUser,
        handler: api.blockUser
    },
    {
        method: 'POST',
        path: '/api/employee/unblockUser',
        options: specs.unblockUser,
        handler: api.unblockUser
    },
    {
        method: 'POST',
        path: '/api/employee/sendConnectionRequest',
        options: specs.sendConnectionRequest,
        handler: api.sendConnectionRequest
    },
    {
        method: 'POST',
        path: '/api/employee/acceptConnectionRequest',
        options: specs.acceptConnectionRequest,
        handler: api.acceptConnectionRequest
    },
    {
        method: 'GET',
        path: '/api/employee/showConnectionRequest',
        options: specs.showConnectionRequest,
        handler: api.showConnectionRequest
    },
    {
        method: 'POST',
        path: '/api/employee/rejectConnectionRequest',
        options: specs.rejectConnectionRequest,
        handler: api.rejectConnectionRequest
    },
    {
        method: 'GET',
        path: '/api/employee/followingJobs',
        options: specs.followingJobs,
        handler: api.followingJobs
    },
    {
        method: 'POST',
        path: '/api/employee/saveJobs',
        options: specs.saveJobs,
        handler: api.saveJobs
    },
    {
        method: 'GET',
        path: '/api/employee/viewSavedJobs',
        options: specs.viewSavedJobs,
        handler: api.viewSavedJobs
    },
    {
        method: 'POST',
        path: '/api/employer/inviteForJob',
        options: specs.inviteForJob,
        handler: api.inviteForJob
    },
    // {
    //     method: 'POST',
    //     path: '/api/employer/acceptInvite',
    //     options: specs.acceptInvite,
    //     handler: api.acceptInvite
    // },
    {
        method: 'POST',
        path: '/api/employer/applyForJob',
        options: specs.applyForJob,
        handler: api.applyForJob
    },
    {
        method: 'POST',
        path: '/api/employer/acceptRejectCandidate',
        options: specs.acceptRejectCandidate, 
        handler: api.acceptRejectCandidate
    },
    {
        method: 'POST',
        path: '/api/employer/acceptRejectFromCandidate',
        options: specs.acceptRejectFromCandidate,
        handler: api.acceptRejectFromCandidate
    },
    {
        method: 'POST',
        path: '/api/employer/scheduleInterview',
        options: specs.scheduleInterview,
        handler: api.scheduleInterview
    },
    {
        method: 'POST',
        path: '/api/employee/referJobs',
        options: specs.referJobs,
        handler: api.referJobs
    },
    {
        method: 'POST',
        path: '/api/employee/selectInterviewTime',
        options: specs.selectInterviewTime,
        handler: api.selectInterviewTime
    },
    {
        method: 'POST',
        path: '/api/employer/hireRejectCandidate',
        options: specs.hireRejectCandidate,
        handler: api.hireRejectCandidate
    },
    {
        method: 'GET',
        path: '/api/employer/viewReferredJobs',
        options: specs.viewReferredJobs,
        handler: api.viewReferredJobs
    },
    {
        method: 'GET',
        path: '/api/employer/viewAssociateConnected',
        options: specs.viewAssociateConnected,
        handler: api.viewAssociateConnected
    },
    {
        method: 'GET',
        path: '/api/employer/viewAppliedJobs',
        options: specs.viewAppliedJobs,
        handler: api.viewAppliedJobs
    },
    {
        method: 'GET',
        path: '/api/employer/viewInterviewingRequests',
        options: specs.viewInterviewingRequests,
        handler: api.viewInterviewingRequests
    },
    {
        method: 'GET',
        path: '/api/employer/viewInterviewing',
        options: specs.viewInterviewing,
        handler: api.viewInterviewing
    },
    {
        method: 'GET',
        path: '/api/employer/viewOfferedJobs',
        options: specs.viewOfferedJobs,
        handler: api.viewOfferedJobs
    },
    {
        method: 'POST',
        path: '/api/employee/withdrawApplication',
        options: specs.withdrawApplication,
        handler: api.withdrawApplication
    },
    {
        method: 'GET',
        path: '/api/employee/viewCompanyJobs',
        options: specs.viewCompanyJobs,
        handler: api.viewCompanyJobs
    },
    {
        method: 'GET',
        path: '/api/employee/viewBlockedUsers',
        options: specs.viewBlockedUsers,
        handler: api.viewBlockedUsers
    },
    {
        method: 'GET',
        path: '/api/employee/searchCompanies',
        options: specs.searchCompanies,
        handler: api.searchCompanies
    },
    {
        method: 'GET',
        path: '/api/employee/searchAssociates',
        options: specs.searchAssociates,
        handler: api.searchAssociates
    },
    {
        method: 'GET',
        path: '/api/employee/companyList',
        options: specs.companyList,
        handler: api.companyList
    },
    {
        method: 'GET',
        path: '/api/employee/associateList',
        options: specs.associateList,
        handler: api.associateList
    },
    {
        method: 'GET',
        path: '/api/employer/fetchFeaturedCandidate',
        options: specs.fetchFeaturedCandidate,
        handler: api.fetchFeaturedCandidate
    },
    {
        method: 'POST',
        path: '/api/employee/changeWorkingStatus',
        options: specs.changeWorkingStatus,
        handler: api.changeWorkingStatus
    },
    {
        method: 'GET',
        path: '/api/employer/candidateStats',
        options: specs.candidateStats,
        handler: api.candidateStats
    },
    {
        method: 'GET',
        path: '/api/employer/employerJobStats',
        options: specs.employerJobStats,
        handler: api.employerJobStats
    },
    {
        method: 'POST',
        path: '/api/employee/reportUser',
        options: specs.reportUser,
        handler: api.reportUser
    },
    {
        method: 'GET',
        path: '/api/employee/userExperience',
        options: specs.userExperience,
        handler: api.userExperience
    },
    {
        method: 'POST',
        path: '/api/employer/searchEmployee',
        options: specs.searchEmployee,
        handler: api.searchEmployee
    },

    {
        method: 'POST',
        path: '/api/employer/searchEmployeeFilter',
        options: specs.searchEmployeeFilter,
        handler: api.searchEmployeeFilter
    },
    {
        method: 'POST',
        path: '/api/employer/reviewEmployee',
        options: specs.reviewEmployee,
        handler: api.reviewEmployee
    },
    {
        method: 'POST',
        path: '/api/employer/fetchRecommendedEmployees',
        options: specs.fetchRecommendedEmployees,
        handler: api.fetchRecommendedEmployees
    },
    {
        method: 'POST',
        path: '/api/employer/inviteRecommendedEmployees',
        options: specs.inviteRecommendedEmployees,
        handler: api.inviteRecommendedEmployees
    },
    {
        method: 'POST',
        path: '/api/employer/contactUs',
        options: specs.contactUs,
        handler: api.contactUs
    },
    {
        method: 'POST',
        path: '/api/employer/registrationappUs',
        options: specs.registrationappUs,
        handler: api.registrationappUs
    },
    {
        method: 'GET',
        path: '/api/employer/viewInvitedJobs',
        options: specs.viewInvitedJobs,
        handler: api.viewInvitedJobs
    },
    {
        method: 'POST',
        path: '/api/employer/searchFeaturedCandidate',
        options: specs.searchFeaturedCandidate,
        handler: api.searchFeaturedCandidate
    },
    {
        method: 'POST',
        path: '/api/employer/filterFeaturedCandidate',
        options: specs.filterFeaturedCandidate,
        handler: api.filterFeaturedCandidate
    },
    {
        method: 'GET',
        path: '/api/employer/selfProfile',
        options: specs.selfProfile,
        handler: api.selfProfile
    },
    {
        method: 'GET',
        path: '/api/employer/availableCreditslist',
        options: specs.availableCreditslist,
        handler: api.availableCreditslist
    },
    {
        method: 'GET',
        path: '/api/employer/fetchCompanyReviews',
        options: specs.fetchCompanyReviews,
        handler: api.fetchCompanyReviews
    },
    {
        method: 'POST',
        path: '/api/employer/creditDeductionEmployerProfile',
        options: specs.creditDeductionEmployerProfile,
        handler: api.creditDeductionEmployerProfile
    },
    {
        method: 'POST',
        path: '/api/employer/changeEmail',
        options: specs.changeEmail,
        handler: api.changeEmail
    },
    {
        method: 'POST',
        path: '/api/employee/cancelInterview',
        options: specs.cancelInterview,
        handler: api.cancelInterview
    },{
        method: 'GET',
        path: '/api/employee/deleteAccount',
        options: specs.deleteAccount,
        handler: api.deleteAccount
    },{
        method: 'POST',
        path: '/api/employee/UpdatePvaName',
        options: specs.UpdatePvaName,
        handler: api.UpdatePvaName
    },{
        method: 'POST',
        path: '/api/employee/CheckingEmployeracces',
        options: specs.CheckingEmployeracces,
        handler: api.CheckingEmployeracces
    },{
        method: 'GET',
        path: '/api/employee/pvanotification',
        options: specs.CheckingPVAnotification,
        handler: api.CheckingPVAnotification
    }, 



]