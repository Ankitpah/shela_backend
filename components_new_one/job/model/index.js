'use strict'
const hooks = require('../hooks')

var job = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    jobTitle: { type: String },
    startDate: { type: Number },
    endDate: { type: Number },
    jobPostedDate: { type: Number },
    minSalary: { type: Number },
    maxSalary: { type: Number },
    skillsRequired: [{ type: String }],
    description: { type: String },
    industryTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "industryType" },
    jobType: { type: String, ref: "jobType" }, // list ????
    noOfVacancy: { type: Number },
    selectcurrencyid: { type: String },
    expReq: { type: Number }, //experience required
    pvaStatus: { type: Number }, //tell wheather pva is accepting or not for the job 1 for no 2 for yes default:1
    address: {
        fullAddress: { type: String },
        city: { type: String },
        pincode: { type: String }
    },
    location: {
        type: { type: String },
        coordinates: [{ type: Number }]
    },
    contactPerson: {
        contactPersonName: { type: String },
        contactPersonEmail: { type: String },
        contactNo: { type: Number },
        contactPersonPosition: { type: String }
    },

    disableEligibleStatus: { type: Number, default: 0 },

    skip: { type: Number },
    limit: { type: Number },
    searchNumber: { type: Number, default: 0 },

    appliedCandidates: [{
        candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "" },
        applicationStatus: { type: Number }, // 8 for rejected
        appliedWithType: { type: Number },
        pvaId: { type: mongoose.Schema.Types.ObjectId, ref: "" },
        interviewingStatus: { type: Number },
        timeSlots: [{ type: Number }],
        interviewTime: { type: Number },

        //also check if the user is invited for the job or not
    }],
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "" },



    invitedCandidates: [{
        candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "" },
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "" },
        JobInviteStatus: { type: Number, default: 1 }
    }],

    status: { type: Number }, //1-ActiveJob 2-CloseJob 3-DraftJob


    isApproved: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },
    isblocked: { type: Boolean, default: false },

    isDeleted: { type: Boolean, default: false }
})

hooks.configure(job)

job.index({ "location.coordinates": '2dsphere' })
module.exports = job