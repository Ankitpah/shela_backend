'use strict'
const validator = require('../validator')
const context = require('../../../utils/context-builder')

module.exports = {
    signUp: {
        description: 'User signUp',
        notes: 'User signUp',
        tags: ['api', 'users'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    }
                }
            }
        },
        validate: {
            payload: validator.signUp.payload,
            failAction: response.failAction
        }
    },
    login: {
        description: 'User manual login',
        notes: 'User login ',
        tags: ['api', 'users'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        headers: {
                            schema: {
                                'x-access-token': 'string',
                                description: 'x-logintoken is found in response headers'
                            }
                        },
                        schema: validator.accessGranted
                    },
                    403: {
                        description: 'UnAuthorized User',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        validate: {
            payload: validator.login.payload,
            failAction: response.accessDeniedAction
        }
    },
    verifyEmail: {
        description: 'Verify User Email Id',
        notes: 'User Verification',
        tags: ['api', 'users'],
        validate: {
            query: validator.verifyEmail.query,
            failAction: response.failAction
        }
    },

    checkEmailExists: {
        description: 'Check if email exists on login/signup',
        notes: 'check email',
        tags: ['api', 'users'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    }
                }
            }
        },
        validate: {
            payload: validator.checkEmailExists.payload,
            failAction: response.failAction
        }
    },

    forgotPassword: {
        description: 'Forgot Password Api',
        notes: 'Verify email to get reset password Details',
        tags: ['api', 'users'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        validate: {
            payload: validator.forgot.payload,
            failAction: response.failAction
        }
    },

    resendEmailVerificationLink: {
        description: 'User Resend Verification Link',
        notes: 'To get verification link again on your email id',
        tags: ['api', 'users'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        validate: {
            payload: validator.resendEmailVerificationLink.payload,
            failAction: response.failAction
        }
    },

    resetPasswordToken: {
        description: 'Verify User for password change',
        notes: 'User Verification For password change',
        tags: ['api', 'users'],
        validate: {
            query: validator.verifyResetPasswordToken.query,
            failAction: response.failAction
        }
    },
    verifyResetPasswordToken: {
        description: "Verify user's token for password change",
        notes: 'User token Verification For password change',
        tags: ['api', 'users'],
        validate: {
            query: validator.verifyResetPasswordToken.query,
            failAction: response.failAction
        }
    },

    changePassword: {
        description: 'User Change Password',
        notes: 'Change/Update Own Password',
        tags: ['api', 'users'],

        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            payload: validator.changePassword.payload,
            headers: validator.header,
            failAction: response.failAction
        }
    },
    setNewPassword: {
        description: 'User Password Reset',
        notes: 'To reset password via resetPasswordToken',
        tags: ['api', 'users'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    }
                }
            }
        },
        validate: {
            payload: validator.setNewPassword.payload,
            failAction: response.failAction
        }
    },
    logout: {
        description: 'User logout',
        notes: 'User log out from system',
        tags: ['api', 'users'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            failAction: response.failAction
        }
    },


    getEmail: {
        description: 'to get email of the user through access token so that it can be autofilled in employee profile step 1',
        notes: 'returns the email of the user',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            failAction: response.failAction
        }
    },


    employerProfileStep1: {
        description: 'For saving employee basic profile details in step 1',
        notes: 'Use this api for employer.',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.employerProfileStep1.payload,
            failAction: response.failAction
        }
    },

    employerProfileStep2: {
        description: 'For saving employee basic profile details in step 2',
        notes: 'Use this api for employer.',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.employerProfileStep2.payload,
            failAction: response.failAction
        }
    },

    employeeProfileStep1: {
        description: 'For saving employee basic profile details in step 1',
        notes: 'Use this api for employee.',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.employeeProfileStep1.payload,
            failAction: response.failAction
        }
    },


    employeeProfileStep2: {
        description: 'For saving employee basic profile details in step 2',
        notes: 'Use this api for employee.',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.employeeProfileStep2.payload,
            failAction: response.failAction
        }
    },

    employeeProfileStep3: {
        description: 'For saving employee basic profile details in step 3',
        notes: 'Use this api for employee.',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.employeeProfileStep3.payload,
            failAction: response.failAction
        }
    },

    employeeProfileStep4: {
        description: 'For saving employee basic profile details in step 4',
        notes: 'Use this api for employee.',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.employeeProfileStep4.payload,
            failAction: response.failAction
        }
    },

    deleteEmployeeProfileStep2: {
        description: 'For delete employee qualification in step 2',
        notes: 'Use this api for employee.',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.deleteEmployeeProfileStep2.payload,
            failAction: response.failAction
        }
    },

    deleteEmployeeProfileStep3: {
        description: 'For delete employee employmentInfo in step 3',
        notes: 'Use this api for employee.',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.deleteEmployeeProfileStep3.payload,
            failAction: response.failAction
        }
    },

    deleteEmployeeProfileStep4: {
        description: 'For delete employee cvId, pvrId, certificateId, bio in step 4',
        notes: 'Use this api for employee.',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.deleteEmployeeProfileStep4.payload,
            failAction: response.failAction
        }
    },

    companyProfile: {
        description: 'For showing company profile',
        notes: 'Use this api for employee',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.companyProfile.query,
            failAction: response.failAction
        }
    },
    skipStep: {
        description: 'For skipping steps',
        notes: 'can Use this api for both employee and employer',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.skipStep.payload,
            failAction: response.failAction
        }
    },
    stepCompleted: {
        description: 'For completed steps',
        notes: 'for completed',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.stepCompleted.payload,
            failAction: response.failAction
        }
    },
    userProfile: {
        description: ' For showing associate profile or candidate profile ',
        notes: 'can Use this api for both employee and employer',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.userProfile.query,
            failAction: response.failAction
        }
    },
    accountPrivacy: {
        description: 'For setting account privacy , set accountprivacystatus as 1 if user want to show all info and set accountprivacystatus as 2 if user want to show less info ',
        notes: 'Use this api for employee, set accountprivacystatus as 1 if user want to show all info and set accountprivacystatus as 2 if user want to show less info',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.accountPrivacy.payload,
            failAction: response.failAction
        }
    },
    followUnfollowCompany: {
        description: 'For following and unfollowing a company , send the company id of the company to be followed or unfollowed ',
        notes: 'Use this api for employee',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.followUnfollowCompany.payload,
            failAction: response.failAction
        }
    },
    review: {
        description: 'For giving rating as well as review to the company',
        notes: 'currently working for employee',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.review.payload,
            failAction: response.failAction
        }
    },
    myPva: {
        description: ' For viewing pva in settings ',
        notes: 'can Use this api for employee',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            failAction: response.failAction
        }
    }
    // ,
    // savedJobs: {
    //     description: ' For saving the jobs ',
    //     notes: 'can Use this api for employee, send the job id of the jobs to be saved ',
    //     tags: ['api', 'employee'],
    //     plugins: {
    //         'hapi-swagger': {
    //             responses: {
    //                 200: {
    //                     description: 'Example of response model in return to success request',
    //                     schema: validator.success
    //                 },
    //                 320: {
    //                     description: 'Example of response model in return to failure request',
    //                     schema: validator.failure
    //                 },
    //                  403: {
    //                     description: 'invalid token/user',
    //                     schema: validator.accessDenied
    //                 }
    //             }
    //         }
    //     },
    //     pre: [{
    //         method: context.validateToken,
    //         assign: 'token'
    //     }],
    //     validate: {
    //         headers: validator.header,
    //         payload: validator.savedJobs.payload,
    //         failAction: response.failAction
    //     }
    // }
    ,
    blockUser: {
        description: ' For blocking user andd keeping record of the blockedUsers ',
        notes: 'can Use this api for employee',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.blockUser.payload,
            failAction: response.failAction
        }
    },
    unblockUser: {
        description: ' For unblocking a associate and update record in the  blockedUsers ',
        notes: 'can Use this api for employee',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.unblockUser.payload,
            failAction: response.failAction
        }
    },
    sendConnectionRequest: {
        description: ' For sending the connection request to the associate , send the user or contact id of the user id to make connection',
        notes: 'can Use this api for employee, send the user or contact id of the user id to make connection',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.sendConnectionRequest.payload,
            failAction: response.failAction
        }
    },
    acceptConnectionRequest: {
        description: ' For accepting the connection request from the associate ',
        notes: 'can Use this api for employee, send the user or contact id of the user id to make connection',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.acceptConnectionRequest.payload,
            failAction: response.failAction
        }
    }

    ,
    showConnectionRequest: {
        description: ' For showing all the connection request from the associateS ',
        notes: 'can Use this api for employee, ',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            failAction: response.failAction
        }
    },
    rejectConnectionRequest: {
        description: ' For rejecting the connection request from the associate ',
        notes: 'can Use this api for employee, send the user or contact id of the user id whose request is to be rejected',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.rejectConnectionRequest.payload,
            failAction: response.failAction
        }
    },
    followingJobs: {
        description: 'to get jobs from following companies',
        notes: 'returns the jobs from followed companies of the user',
        tags: ['api', 'job'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.followingJobs.query,
            failAction: response.failAction
        }
    },
    saveJobs: {
        description: ' For saving a job ',
        notes: 'for saving a job',
        tags: ['api', 'job'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.saveJobs.payload,
            failAction: response.failAction
        }
    },

    viewSavedJobs: {
        description: 'to get saved jobs',
        notes: 'returns the email of the user',
        tags: ['api', 'job'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            failAction: response.failAction
        }
    },
    inviteForJob: {
        description: ' For inviting a candidate to the job ',
        notes: 'for inviting a candidate for the job',
        tags: ['api', 'job'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.inviteForJob.payload,
            failAction: response.failAction
        }
    },
    // acceptInvite: {
    //     description: ' For accepting the invite for the job ',
    //     notes: 'for accepting the invite for the job',
    //     tags: ['api', 'job'],
    //     plugins: {
    //         'hapi-swagger': {
    //             responses: {
    //                 200: {
    //                     description: 'Example of response model in return to success request',
    //                     schema: validator.success
    //                 },
    //                 320: {
    //                     description: 'Example of response model in return to failure request',
    //                     schema: validator.failure
    //                 },
    //                  403: {
    //                     description: 'invalid token/user',
    //                     schema: validator.accessDenied
    //                 }
    //             }
    //         }
    //     },
    //     pre: [{
    //         method: context.validateToken,
    //         assign: 'token'
    //     }],
    //     validate: {
    //         headers: validator.header,
    //         payload: validator.acceptInvite.payload,
    //         failAction: response.failAction
    //     }
    // },

    applyForJob: {
        description: ' For applying to the job ',
        notes: 'for applying to the job',
        tags: ['api', 'job'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.applyForJob.payload,
            failAction: response.failAction
        }
    },
    acceptRejectCandidate: {
        description: ' For accepting or rejecting the candidate for the job ',
        notes: 'For accepting or rejecting the candidate for the job',
        tags: ['api', 'job'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.acceptRejectCandidate.payload,
            failAction: response.failAction
        }
    },
    acceptRejectFromCandidate: {
        description: ' For accepting or rejecting the candidate for the job ',
        notes: 'For accepting or rejecting the candidate for the job',
        tags: ['api', 'job'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.acceptRejectFromCandidate.payload,
            failAction: response.failAction
        }
    },
    scheduleInterview: {
        description: ' For scheduleInterview candidate for the job ',
        notes: 'for schedule Interview',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.scheduleInterview.payload,
            failAction: response.failAction
        }
    },
    referJobs: {
        description: ' For referJobs to associates ',
        notes: 'For referJobs to associates',
        tags: ['api', 'job'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.referJobs.payload,
            failAction: response.failAction
        }
    },
    selectInterviewTime: {
        description: ' For selection of Interview Time for the job by candidate',
        notes: 'for selection of Interview time by the candidate',
        tags: ['api', 'job'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.selectInterviewTime.payload,
            failAction: response.failAction
        }
    },
    hireRejectCandidate: {
        description: ' For hiring or rejecting candidate for the job ',
        notes: 'For hiring or rejecting candidate for the job',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.hireRejectCandidate.payload,
            failAction: response.failAction
        }
    },
    viewReferredJobs: {
        description: ' For viewing reffered jobs ',
        notes: 'For viewing referred jobs',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.viewReferredJobs.query,
            failAction: response.failAction
        }
    },
    viewAssociateConnected: {
        description: ' For viewing associates connected ',
        notes: 'For viewing associates connected',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.viewAssociateConnected.query,
            failAction: response.failAction
        }
    },
    viewAppliedJobs: {
        description: ' For viewing Applied Jobs ',
        notes: 'For viewing Applied Jobs',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.viewAppliedJobs.query,
            failAction: response.failAction
        }
    },
    viewInterviewingRequests: {
        description: ' For viewing Interviewing Requests Jobs ',
        notes: 'For viewing Interviewing Requests Jobs',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.viewInterviewingRequests.query,
            failAction: response.failAction
        }
    },
    viewInterviewing: {
        description: ' For viewing Interviewing Jobs ',
        notes: 'For viewing Interviewing Jobs',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.viewInterviewing.query,
            failAction: response.failAction
        }
    },
    viewOfferedJobs: {
        description: ' For viewing Offered Jobs  ',
        notes: 'For viewing Offered Jobs ',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.viewOfferedJobs.query,
            failAction: response.failAction
        }
    },
    withdrawApplication: {
        description: ' For withdrawing the Application ',
        notes: 'For withdrawing the Application',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.withdrawApplication.payload,
            failAction: response.failAction
        }
    },
    viewCompanyJobs: {
        description: ' For viewing jobs by a company  ',
        notes: 'For viewing jobs by a company',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.viewCompanyJobs.query,
            failAction: response.failAction
        }
    },
    viewBlockedUsers: {
        description: ' For fetching list of blocked contacts  ',
        notes: 'For fetching list of blocked contacts ',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.viewBlockedUsers.query,
            failAction: response.failAction
        }
    },
    searchCompanies: {
        description: ' For searching all Companies by a name  ',
        notes: 'For fetching Companies by a name',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.searchCompanies.query,
            failAction: response.failAction
        }
    },
    searchAssociates: {
        description: ' For searching Associates by name  ',
        notes: 'For searching Associates by name',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.searchAssociates.query,
            failAction: response.failAction
        }
    }


    ,

    companyList: {
        description: ' For searching companyList  ',
        notes: 'For searching companyList',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.companyList.query,
            failAction: response.failAction
        }
    },


    associateList: {
        description: ' For searching associateList  ',
        notes: 'For searching associateList',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.associateList.query,
            failAction: response.failAction
        }
    }

    ,



    fetchFeaturedCandidate: {
        description: ' For  fetchin Featured Candidate  ',
        notes: 'For fetching Featured Candidate',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.fetchFeaturedCandidate.query,
            failAction: response.failAction
        }
    }

    ,
    changeWorkingStatus: {
        description: ' For  changeWorkingStatus  ',
        notes: 'For changeWorkingStatus',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.changeWorkingStatus.payload,
            failAction: response.failAction
        }
    },


    candidateStats: {
        description: ' For  fetchin candidate Stats  ',
        notes: 'For fetching candidate Stats',
        tags: ['api', 'dashboard'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            //query: validator.candidateStats.query,
            failAction: response.failAction
        }
    },

    employerJobStats: {
        description: ' For  fetchin employerJob Stats   ',
        notes: 'For fetching employer Job Stats',
        tags: ['api', 'dashboard'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            //query: validator.candidateStats.query,
            failAction: response.failAction
        }
    },

    reportUser: {
        description: ' For reporting employee   ',
        notes: 'For reporting employee',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.reportUser.payload,
            failAction: response.failAction
        }
    },
    userExperience: {
        description: ' For user Experience of employee   ',
        notes: 'For user Experience of employee',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            //query: validator.userExperience.query,
            failAction: response.failAction
        }
    },

    searchEmployee: {
        description: ' For searching Employee  ',
        notes: 'For searching Employee',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.searchEmployee.payload,
            failAction: response.failAction
        }
    },
    searchEmployeeFilter: {
        description: ' For search Employee Filter  ',
        notes: 'For search Employee Filter',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.searchEmployeeFilter.payload,
            failAction: response.failAction
        }
    }


    ,
    reviewEmployee: {
        description: ' For reviewEmployee   ',
        notes: 'For reviewEmployee',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.reviewEmployee.payload,
            failAction: response.failAction
        }
    }


    ,
    fetchRecommendedEmployees: {
        description: ' For fetching Recommended Employees   ',
        notes: 'For fetching Recommended Employees',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.fetchRecommendedEmployees.payload,
            failAction: response.failAction
        }
    },
    inviteRecommendedEmployees: {
        description: ' For inviting Recommended Employees  ',
        notes: 'For inviting Recommended Employees ',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.inviteRecommendedEmployees.payload,
            failAction: response.failAction
        }
    }


    ,
    contactUs: {
        description: ' For contacting Shela Admin     ',
        notes: 'For contacting Shela Admin  ',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
       
        validate: {
           // headers: validator.header,
            payload: validator.contactUs.payload,
            failAction: response.failAction
        }
    },
    registrationappUs: {
        description: ' For contacting Shela Admin     ',
        notes: 'For contacting Shela Admin  ',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
       
        validate: {
           // headers: validator.header,
            payload: validator.registrationappUs.payload,
            failAction: response.failAction
        }
    },
    viewInvitedJobs: {
        description: ' For viewing Invited Jobs ',
        notes: 'For viewing Invited Jobs',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.viewInvitedJobs.query,
            failAction: response.failAction
        }
    },

    searchFeaturedCandidate: {
        description: ' For searhing featured candidates ',
        notes: 'For searhing featured candidates',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.searchFeaturedCandidate.payload,
            failAction: response.failAction
        }
    },

    filterFeaturedCandidate: {
        description: ' For filtering featured candidates ',
        notes: 'For filtering featured candidates',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.filterFeaturedCandidate.payload,
            failAction: response.failAction
        }
    },

    selfProfile: {
        description: ' For the company profile   ',
        notes: 'For self profile view by company ',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.selfProfile.query,
            failAction: response.failAction
        }
    },

    availableCreditslist: {
        description: ' For the available credits   ',
        notes: 'For available credits view by company ',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.availableCreditslist.query,
            failAction: response.failAction
        }
    },

    fetchCompanyReviews: {
        description: ' For  fetching company reviews  ',
        notes: 'For fetching company reviews  ',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.fetchCompanyReviews.query,
            failAction: response.failAction
        }
    },

    creditDeductionEmployerProfile: {
        description: ' For  credit Deduction Employer Profile  ',
        notes: 'For credit Deduction Employer Profile  ',
        tags: ['api', 'CreditDeduction'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.creditDeductionEmployerProfile.payload,
            failAction: response.failAction
        }
    },
    updateEmployerProfileStep2: {
        description: ' For  updateEmployerProfileStep2  ',
        notes: 'For updateEmployerProfileStep2 ',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.updateEmployerProfileStep2.payload,
            failAction: response.failAction
        }
    },

    updateEmployerProfileStep1: {
        description: ' For  updateEmployerProfileStep1  ',
        notes: 'For updateEmployerProfileStep1 ',
        tags: ['api', 'employer'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.updateEmployerProfileStep1.payload,
            failAction: response.failAction
        }
    }

    ,

    changeEmail: {
        description: ' For  secondary Email  ',
        notes: 'For secondary Email  ',
        tags: ['api', 'Users'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.changeEmail.payload,
            failAction: response.failAction
        }
    },
    cancelInterview: {
        description: ' Cancel interview  ',
        tags: ['api', 'Users'],
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.cancelInterview.payload,
            failAction: response.failAction
        }
    },
    socialLoginSignUp: {
        description: ' Social Signup/Login  ',
        notes: "2 for facebOok, 3 for google,4 for linkedIn",
        tags: ['api', 'users'],
        validate: {
            payload: validator.socialLoginSignUp.payload,
            failAction: response.failAction
        }
    },

    // deleteAccount: {
    //     description: 'For delete Account',
    //     notes: 'Use this api for employee.',
    //     tags: ['api', 'employee'],
    //     validate: {
    //         headers: validator.header,
    //         // payload: validator.deleteAccount.payload,
    //         failAction: response.failAction
    //     }
    // }

    deleteAccount: {
        description: ' For the company deleteAccount   ',
        notes: 'For self deleteAccount view by company ',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.deleteAccount.query,
            failAction: response.failAction
        }
    },

    UpdatePvaName: {
        description: ' For the employee to update pva name   ',
        notes: 'For self UpdatePvaName view by employee ',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.UpdatePvaName.payload,
            failAction: response.failAction
        }
    },

    
    CheckingEmployeracces: {
        description: ' For the employee to Checking Employer acces',
        notes: 'For self Checking Employer acces view by employee ',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.CheckingEmployeracces.payload,
            failAction: response.failAction
        }
    },

    CheckingPVAnotification: {
        description: ' For the PVA Notification to Checking Employer acces',
        notes: 'For self Checking Employer acces view by PVA Notification ',
        tags: ['api', 'employee'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    200: {
                        description: 'Example of response model in return to success request',
                        schema: validator.success
                    },
                    320: {
                        description: 'Example of response model in return to failure request',
                        schema: validator.failure
                    },
                    403: {
                        description: 'invalid token/user',
                        schema: validator.accessDenied
                    }
                }
            }
        },
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.CheckingPVAnotification.payload,
            failAction: response.failAction
        }
    },


}