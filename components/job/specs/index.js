'use strict'
const validator = require('../validator')
const context = require('../../../utils/context-builder')

module.exports = {
    postJob: {
        description: 'Use api to post a new job or to save job as draft/savedjob',
        notes: 'tell you later',
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
                    400: {
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
            payload: validator.postJob.payload,
            failAction: response.failAction
        }
    },
    editJob : {
         description: 'Use api to edit job details',
        notes: 'Edit job details',
        tags: ['api', 'job'],
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            payload: validator.editJob.payload,
            failAction: response.failAction
        }
    },


    closeJob: {
        description: 'Use api to close a job',
        notes: 'tell you later',
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
                    400: {
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
            payload: validator.closeJob.payload,
            failAction: response.failAction
        }
    },
    removeJob: {
        description: 'Use api to remove a job',
        notes: 'tell you later',
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
                    400: {
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
            payload: validator.removeJob.payload,
            failAction: response.failAction
        }
    },

    manageJob: {
        description: 'Use api to view job details during manage job tab',
        notes: 'tell you later',
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
                    400: {
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
            payload: validator.manageJob.payload,
            failAction: response.failAction
        }
    },

    allJobs: {
        description: 'Use api to view all jobs , by default show jobs in nearby location ',
        notes: 'for showiing all jobs to the employee',
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
                    400: {
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
            query: validator.allJobs.query,
            failAction: response.failAction
        }
    },

    jobProfile: {
        description: 'through this employee can see the profile of a job',
        notes: 'employee can see the job profile here and apply from here',
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
                    400: {
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
            query: validator.jobProfile.query,
            failAction: response.failAction
        }
    },
    searchByJobPosition: {
        description: 'for searching based on JobPosition',
        notes: 'for searching based on JobPosition',
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
                    400: {
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
            query: validator.searchByJobPosition.query,
            failAction: response.failAction
        }
    },
    searchByJobType: {
        description: 'for searching based on JobType',
        notes: 'for searching based on JobType',
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
                    400: {
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
            query: validator.searchByJobType.query,
            failAction: response.failAction
        }
    },
    jobFilters: {
        description: 'for filtering the jobs based on the filters provided by the employee',
        notes: 'for filtering the jobs based on the filters provided by the employee',
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
                    400: {
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
            payload: validator.jobFilters.payload,
            failAction: response.failAction
        }
    },

    popularSearch: {
        description: 'for popular Searches',
        notes: 'for popular Searches',
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
                    400: {
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
            //query: validator.searchByJobPosition.query,
            failAction: response.failAction
        }
    },
    postDraftJob: {
        description: 'for postDraftJob',
        notes: 'for postDraftJob',
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
                    400: {
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
            query: validator.postDraftJob.query,
            failAction: response.failAction
        }
    },

    fetchPostedJobs: {
        description: 'for fetching Posted Jobs based on the status',
        notes: 'for fetching Posted Jobs based on the status',
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
                    400: {
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
            query: validator.fetchPostedJobs.query,
            failAction: response.failAction
        }
    },

    fetchAllCandidates: {
        description: 'for fetching all candidates applied on the job',
        notes: 'for fetching all candidates applied on the job',
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
                    400: {
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
            query: validator.fetchAllCandidates.query,
            failAction: response.failAction
        }
    },

    fetchUserProfile: {
        description: 'for fetchUserProfile',
        notes: 'for fetchUserProfile',
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
                    400: {
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
            query: validator.fetchUserProfile.query,
            failAction: response.failAction
        }
    }

    ,

    fetchShortlistedCandidates: {
        description: 'for fetching shortlisted candidates applied on the job',
        notes: 'for fetching shortlisted candidates applied on the job',
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
                    400: {
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
            query: validator.fetchShortlistedCandidates.query,
            failAction: response.failAction
        }
    },


    fetchInterviewingCandidates: {
        description: 'for fetching interviewing candidates applied on the job',
        notes: 'for fetching interviewing candidates applied on the job',
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
                    400: {
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
            query: validator.fetchInterviewingCandidates.query,
            failAction: response.failAction
        }
    },

    fetchHiredCandidates: {
        description: 'for fetching hired candidates applied on the job',
        notes: 'for fetching hired candidates applied on the job',
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
                    400: {
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
            query: validator.fetchHiredCandidates.query,
            failAction: response.failAction
        }
    }





    ,

    fetchEmployeeReview: {
        description: 'for fetching employee review',
        notes: 'for fetching employee review',
        tags: ['api', 'Employer'],
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
                    400: {
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
            query: validator.fetchEmployeeReview.query,
            failAction: response.failAction
        }
    },
    fetchInterviewingCalendar: {
        description: 'for fetching interviewing calendar',
        tags: ['api', 'Employer'],
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            failAction: response.failAction
        }
    },
    fetchDashboardGraph: {
        description: 'for fetching data for graphs on Employer dashboard',
        notes: "Send 1 for fetching data of Candidate , 2 for employer",
        tags: ['api', 'Employer'],
        pre: [{
            method: context.validateToken,
            assign: 'token'
        }],
        validate: {
            headers: validator.header,
            query: validator.fetchDashboardGraph.query,
            failAction: response.failAction
        }
    }



}