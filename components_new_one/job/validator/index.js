'use strict'
const Joi = require('joi')

module.exports = {

    postJob: {
        payload: {

            jobTitle: Joi.string().required().trim().description('job postion or title of position'),
            industryTypeId: Joi.string().allow("").trim().description('industry Type'),
            description: Joi.string().required().trim().description('description'),
            noOfVacancy: Joi.number().required().description('number of vacancy'),
            selectcurrencyid: Joi.string().required().description('select currency'),
            minSalary: Joi.number().required().description('min salary range }'),
            maxSalary: Joi.number().required().description('max salary range }'),
            skillsRequired: Joi.array().allow("").description('skills needed for job'),

            //    skillsRequired:Joi.object().keys({
            //     name: Joi.string().required().trim(),
            //    }).required().description("the skills array of objects"),


            expReq: Joi.number().required().description('experience required'),
            address: Joi.object().keys({
                fullAddress: Joi.string().required().trim(),
                city: Joi.string().required().trim(),
                pincode: Joi.string().required()
            }).required().label('address'),
            location: Joi.object().keys({
                type: Joi.string().allow("").trim().default("point"),
                coordinates: Joi.array().allow("")
            }),
            jobType: Joi.string().allow("").trim().description('type of job , part time full time, etc'),
            startDate: Joi.number().required(),
            endDate: Joi.number().required(),
            pvaStatus: Joi.number().required().description('pva status must b no. 1 for not aceepting 2 for accepting, default as 1'),
            contactPersonId: Joi.object().keys({
                contactPersonName: Joi.string().required().trim(),
                contactPersonEmail: Joi.string().email().required().description('Valid email Id'),
                contactPersonPosition: Joi.string().required().trim(),
                contactNo: Joi.number().required()
            }).required().description('_id of person posting the job'),
            status: Joi.number().required().description("1-ActiveJob 2-CloseJob 3-DraftJob"),
            disableEligibleStatus: Joi.number().required().description("if disable are eligible for this job or not, default :0 that is not eligible, and 1 for eligible"),
            jobPostedDate: Joi.number().required().description("date on which job was posted")
        }
    },

    editJob: {
        payload: {
            jobId: Joi.string().required(),
            jobTitle: Joi.string().required().trim().description('job postion or title of position'),
            industryTypeId: Joi.string().allow("").trim().description('industry TypeId'),
            description: Joi.string().required().trim().description('description'),
            noOfVacancy: Joi.number().required().description('number of vacancy'),
            selectcurrencyid: Joi.string().required().description('select currency'),
            minSalary: Joi.number().required().description('min salary range }'),
            maxSalary: Joi.number().required().description('max salary range }'),
            skillsRequired: Joi.array().allow("").description('skills needed for job'),
            expReq: Joi.number().required().description('experience required'),
            address: Joi.object().keys({
                fullAddress: Joi.string().required().trim(),
                city: Joi.string().required().trim(),
                pincode: Joi.string().required()
            }).required().label('address'),
            location: Joi.object().keys({
                type: Joi.string().allow("").trim().default("point"),
                coordinates: Joi.array().allow("")
            }),
            jobType: Joi.string().allow("").trim().description('type of job , part time full time, etc'),
            startDate: Joi.number().required(),
            endDate: Joi.number().required(),
            pvaStatus: Joi.number().required().description('pva status must b no. 1 for not aceepting 2 for accepting, default as 1'),
            contactPersonId: Joi.object().keys({
                contactPersonName: Joi.string().required().trim(),
                contactPersonEmail: Joi.string().email().required().description('Valid email Id'),
                contactPersonPosition: Joi.string().required().trim(),
                contactNo: Joi.number().required()
            }).required().description('_id of person posting the job'),
            status: Joi.number().required().description("1-ActiveJob 2-CloseJob 3-DraftJob"),
            disableEligibleStatus: Joi.number().required().description("if disable are eligible for this job or not, default :0 that is not eligible, and 1 for eligible"),
            jobPostedDate: Joi.number().required().description("date on which job was posted")

        }
    },

    fetchPostedJobs: {
        query: {
            status: Joi.number().description("the status of jobs to search send one for active, 2 for closed and 3 for drafted jobs"),
            skip: Joi.number().description("for paginations, no of records to skip"),
            limit: Joi.number().description("the no of records to show first"),
            sortingType: Joi.number().description("send 1 for oldest first and -1 for newest first")

        }
    },
    postDraftJob: {
        query: {
            jobId: Joi.string().required().description("close the job with jobId")
        }
    },

    closeJob: {
        payload: {
            jobId: Joi.string().required().description("close the job with jobId")
        }
    },
    removeJob: {
        payload: {
            jobId: Joi.string().required().description("remove the job with jobId")
        }
    },


    manageJob: {
        payload: {
            jobId: Joi.string().required().description("close the job with jobId")
        }
    },
    allJobs: {
        query: {
            //jobId: Joi.string().required().description("close the job with jobId")

            // location:Joi.object().keys({ 
            //     type:Joi.string().trim().default("point"),
            //     coordinates: Joi.array().description("coordinates")
            // }), 
            skip: Joi.number().description("for paginations, no of records to skip"),
            limit: Joi.number().description("the no of records to show first")

        }
    },
    searchByJobPosition: {
        query: {
            jobTitle: Joi.string().required().description("enter the job title or job position of the job to search")
        }
    },
    searchByJobType: {
        query: {
            search: Joi.string().optional().allow("").description("enter the job title of the job to search"),
            jobType: Joi.string().valid(['', 'saved', 'invited', "applied", 'interviewingRequests', "interviewing", 'offered']).default('')
        }
    },
    jobProfile: {
        query: {
            jobId: Joi.string().trim().required().description("the job id of the job to view profile")
        }
    },
    jobFilters: {
        payload: {
            // Default values need to be set here..... from shela profile if relevance selected

            showResultType: Joi.number().allow("").optional().description("set as 1 if users want to see recent posted jobs and 2 if he want to search based on his shela profile, default is 1"),
            industryTypeId: Joi.string().allow("").optional().description("type of industry from drop down list"),
            maxDistance: Joi.number().allow("").optional().description("max distsnce for finding location in miles"),
            minSalary: Joi.number().allow("").optional().description("the min salary"),
            maxSalary: Joi.number().allow("").optional().description("the max salary"),
            expReqLowerLimit: Joi.number().allow("").optional().description("the experience reqd lower limit"),
            expReqUpperLimit: Joi.number().allow("").optional().description("the experience reqd lower limit"),
            skillsRequired: Joi.array().allow("").optional().description('skills needed for job'),
            disableEligibleStatus: Joi.number().optional().allow("").description("if the user want to see jobs for which disabled people can also apply "),
            jobType: Joi.string().allow("").optional().description("type of the job like part , full time, etc"),

            //maxDistance:Joi.number().optional().description("jobs within radius miles"),
            location: Joi.object().keys({
                type: Joi.string().allow("").optional().trim().default("point"),
                coordinates: Joi.array().allow("").optional().description("coordinates")
            }).allow("").optional()


        }
    },
    fetchAllCandidates: {
        query: {
            jobId: Joi.string().trim().description("the job id")
        }
    },
    fetchShortlistedCandidates: {
        query: {
            jobId: Joi.string().trim().description("the job id")
        }
    },
    fetchInterviewingCandidates: {
        query: {
            jobId: Joi.string().trim().description("the job id")
        }
    },
    fetchHiredCandidates: {
        query: {
            jobId: Joi.string().trim().description("the job id")
        }
    },
    fetchUserProfile: {
        query: {
            empId: Joi.string().trim().description("the job profile")
        }
    },
    fetchEmployeeReview: {
        query: {
            empId: Joi.string().trim().description("the employee Id")
        }
    },
    fetchDashboardGraph: {
        query: {
            type: Joi.number().valid([1, 2]).default(1).required()
        }
    },

    header: Joi.object({
        'x-logintoken': Joi.string().required().trim().description('Provide token to access api')
    }).unknown()
}