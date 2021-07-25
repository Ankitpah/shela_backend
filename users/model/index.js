'use strict'
const hooks = require('../hooks')

const users = new mongoose.Schema({
    fullName: { type: String },
    email: { type: String },
    password: { type: String },
    userRole: { type: String, enum: ["employee", "employer", "admin"] },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dob: { type: Number },
    contactNumber: { type: Number },
    countryCode: { type: String },
    totalCredits: {type: Number, default:null},
    availableCredits: {type: Number,default:null},
    isPaid:{ type: Boolean, default: false },   
    usedCredits: {type: Number},
    address: {
        fullAddress: { type: String },
        city: { type: String },
        pincode: { type: String },
        // lat:{type : Number},
        // long:{type : Number}
    },

    //timeSlots:[{type :Number}],

    slot: { type: Number },
    slot2: { type: Number },
    slot3: { type: Number },
    bio: { type: String },

    accepted: { type: Number },

    appliedJobs: [{
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "job" },
        applyingWithType: { type: Number }, // 1 for with pvr and 2 for with pva
        applicationStatus: { type: Number }, // 8 for rejected,5-hired,2-whenapplicatopn accepted,3-interview scheduled
        timeSlots: [{ type: Number }],
        interviewingStatus: { type: Number },
        interviewTime: { type: Number }
    }],

    location: {
        type: {type: String, default: "Point"},
        coordinates: [Number]
    },
    applyingWithType: { type: Number },
    subscriptionStatus: { type: Number, default: 0 }, // status 0 if not subscribed and 1 if is subscribed,
    isCommercialVideo: { type: Boolean, default: false },
    skills: [{ type: String , ref: "skills"/*mongoose.Schema.Types.ObjectId, ref: "" */ }],
    industryPreffered: [{ type: mongoose.Schema.Types.ObjectId, ref: "" }],
    //serviceId: [{ type: String }],
    companyFollowers: { type: Number, default: 0 },
    companyLogo: { type: mongoose.Schema.Types.ObjectId, ref: "" },
    companyVideo: { type: mongoose.Schema.Types.ObjectId, ref: "" },
    industryTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "industryType" },
    serviceId: [{ type: mongoose.Schema.Types.ObjectId, ref: "services" }],
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "" },
    languageId: [{ type: mongoose.Schema.Types.ObjectId, ref: "languages" }],
    currentPositionId: { type: String },
    profilePicId: { type: mongoose.Schema.Types.ObjectId, ref: "" },

    step: { type: Number },

    userBlockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "" }],

    document: {
        pvrId: { type: String /*mongoose.Schema.Types.ObjectId, ref: "" */ },
        cvId: { type: String /*mongoose.Schema.Types.ObjectId, ref: ""*/ },
        certificateId: [{ type: String /*mongoose.Schema.Types.ObjectId, ref: ""*/ }],
        pvaId: [{
            pva_id: { type: String }, /* mongoose.Schema.Types.ObjectId, ref: "" */
            pva_name: { type: String },
            pva_date: { type: Number}
        }],
    },
    subscriptionStatus: { type: Number, default: 0 },

    followedCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    associateConnected: [{
        contactId: { type: mongoose.Schema.Types.ObjectId, ref: "" },
        from: { type: mongoose.Schema.Types.ObjectId, ref: "" },
        requestStatus: { type: Number }
    }],
    //blockedUser:[{ type: mongoose.Schema.Types.ObjectId, ref: ""}],
    associateId: { type: mongoose.Schema.Types.ObjectId, ref: "" },

    recommendation: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "" },
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "" }
    }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "" }],
    referredJobs: [{
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "" },
        // associateId:{type: mongoose.Schema.Types.ObjectId,ref: ""},
        refferedBy: { type: mongoose.Schema.Types.ObjectId, ref: "" }

    }],

    // , unique: true
    registrationNumber: { type: String },
    description: { type: String },
    contactPerson: {
        name: { type: String },
        position: { type: String, ref: "currentPosition"  },
        contactNumber: { type: Number },
        emailId: { type: String }
    },
    rating: {
        averageRating: { type: Number, default: 0 },
        totalRating: { type: Number, default: 0 },
        noOfRatings: { type: Number, default: 0 }
    },
    // skip:{type:Number},
    // limit:{type: Number}
    // ,

    jobInvites: [{
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "job" },
        jobInviteStatus: { type: Number, default: 0 }
    }],
    currentWorkingStatus: { type: Boolean, default: false },
    invitedCandidates:[{
        candidateId:{type:mongoose.Schema.Types.ObjectId, ref: ""},   //uncommneted whole object
        jobId:{type:mongoose.Schema.Types.ObjectId, ref: ""},
        JobInviteStatus:{type:Number, default:1}
    }],
    review: [{
        from: { type: mongoose.Schema.Types.ObjectId, ref: "" },
        toUser: { type: mongoose.Schema.Types.ObjectId, ref: "" },
        ratingGiven: { type: Number },
        reviewDetail: { type: String },
        reviewTime: { type: Number }
    }],
    sentRequests: [{
        toContactId: { type: mongoose.Schema.Types.ObjectId, ref: "" },
        requestStatus: { type: Number } // 1 for pending and 2 for accepted
    }],
    toContactId: { type: mongoose.Schema.Types.ObjectId, ref: "" },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "" },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    associateRequests: [{
        from: { type: mongoose.Schema.Types.ObjectId, ref: "" },
        toContactId: { type: mongoose.Schema.Types.ObjectId, ref: "" },
        requestStatus: { type: Number, default: 0 } // 0 not connected 1 for pending and 2 for connected
    }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "" }],
    disability: {
        disabilityStatus: { type: Number, default: 0 }, // status 0 means not disable person 1 means is disabled
        description: { type: String }
    },
    qualification: [{
        degree: { type: String },
        institution: { type: String },
        from: { type: Number },
        to: { type: Number }
    }],
    employmentInfo: [{
        companyName: { type: String },
        from: { type: Number },
        to: { type: Number },
        jobTitle: { type: String }
    }],
    totalExperience: { type: Number },
    followingStatus: { type: Number },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "" }, //companyId
    accountPrivacyStatus: { type: Number, default: 1 }, //account privacy
    isApproved: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },
    isblocked: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    registraionKey : {type : String},
    userRegisterationTime: { type: Number },
    profileCompletionTime: { type: Number },
    lastProfileUpdatedTime: { type: Number },
    accountVerificationTime: { type: Number },
    deviceDetails: {
        accessToken: { type: String },
        timeStamp: { type: Number },
        socketId: { type: String },
        timeZone: { type: String } // user's timezone
    },
    fcmToken:{type: String},
    stepNumber: { type: Number },
    profileStepCompleted: { type: Number, default: 0 }, // profile steps completed
    //stepSkipped:[{type: Number }],
    emailVerifyToken: { type: String },
    resetPasswordToken: { type: String },
    isDeleted: { type: Boolean, default: false },

    stripeCardId: { type: String },

    stripeSubscriptionId: { type: String },

    stripeCustomerId: { type: String },
    stripeBankId: { type: String },
    isCardDetailsAdded: { type: Boolean, default: false },


    //*****  new fields *********/
    freeMsgCount: { type: Number },
    freePvaCount: { type: Number },
    creditLeft: { type: Number },
    pvaViewedOf: [{ type: String }],
    cvViewedOf: [{ type: String }],
    companyVideoViewedBy: [{ type: String }],
    sentMsgsTo: [{ type: String }],



    // new fields for social signUp 

    googleLoginId: { type: String },
    facebookLoginId: { type: String },
    linkedInLoginId: { type: String },
    //loginType: { type: Number },


    graphData: { //All the fields will store number ; employer side graph data
        companyPageView: { type: Number, default: 0 },
        jobListingEngagement: { type: Number, default: 0 },
        pvaSentIn: { type: Number, default: 0 },
        inviteesAccepted: { type: Number, default: 0 },
        applicationsMade: { type: Number, default: 0 },
        applicationsWithdraw: { type: Number, default: 0 },
        cvViewed: { type: Number, default: 0 },
        pvrReceived: { type: Number, default: 0 },
        pvaReceived: { type: Number, default: 0 },
        messagingContactsMade: { type: Number, default: 0 },
        interviewInviteSent: { type: Number, default: 0 },
        hiredCandidates: { type: Number, default: 0 },
    }


})

users.index({ "location.coordinates": '2dsphere' })
module.exports = users