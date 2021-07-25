'use strict'

const md5 = require('md5')
const Promise = require('bluebird')
const auth = require('../../../utils/auth')


const postJob = async (params) => {
    const log = logger.start('job:service:postJob')
    const savedJobDetails = await db.job(params).save();
    log.end()
    return savedJobDetails;
}

const editJob = async (params) => {

    await db.job.findOneAndUpdate({ _id: params.jobId }, params, { new: true })
    return "Job updated successfully"
}

const closeJob = async (params) => {
    const log = logger.start('job:service:postJob')

    //close the job manually or close the job on the expiry date of the job
    const data = await db.job.findOneAndUpdate({ _id: params.jobId, companyId: params.userInfo }, { status: 2 })
    return data
}
const removeJob = async (params) => {
    const log = logger.start('job:service:postJob')
    const data = await db.job.findOneAndUpdate({ _id: params.jobId }, { isDeleted : true,status: 4 },{new:true})
    log.end()
    console.log('data======>',data)
    return data
}

const manageJob = async (params) => {
    const log = logger.start('job:service:manageJob')
    const data = await db.job.find({ _id: params.jobId, status: 1, companyId: params.userId }, { _id: 1, status: 1, endDate: 1 }, { lean: true })
    let currentTime = moment().unix()

    for (let i = 0; i < data.length; i++) {
        if (data[i].endDate <= currentTime) {
            await db.job.findOneAndUpdate({ _id: data[i]._id }, { status: 2 })
        }
    }
    const data1 = await db.job.findOne({ _id: params.jobId, companyId: params.userId }, { expReq: 1, noOfVacancy: 1,selectcurrencyid:1, jobType: 1, pvaStatus: 1, industryTypeId: 1, _id: 1, status: 1, address: 1, jobPostedDate: 1, jobTitle: 1, startDate: 1, skillsRequired: 1, minSalary: 1, maxSalary: 1, description: 1, endDate: 1 }, { lean: true })
        .populate({ path: "industryTypeId", model: "industryType", select: "name" })
    let res = []
    let obj1 = {
        _id: "",
        status: 0,
        address: "",
        jobTitle: "",
        startDate: 0,
        skillsRequired: [],
        minSalary: 0,
        maxSalary: 0,
        endDate: 0,
        jobPostedDate: 0,
        description: "",
        jobType: "",
        industryTypeId: {},
        pvaStatus: 0,
        noOfVacancy: 0,
        // selectcurrencyid = "",
        expReq: 0
    }
    let counter = 0
    // for(let j=0;j<data1.length;j++)
    // {
    //     for(let k=0;k<data[j].skillsRequired.length;K++)
    //     {
    //         if()
    //     }
    // }

    //     for( counter=0;counter<data1.length;counter++)
    //    //await data.forEach(async (obj) =>
    //     {
    let x;
    if (data1) {
        x = await db.skills.find({ "_id": { $in: data1.skillsRequired } }, { name: 1, _id: 1 }, { lean: true })
    }
    obj1 = {
        _id: data1._id,
        jobTitle: data1.jobTitle,
        description: data1.description,
        maxSalary: data1.maxSalary,
        minSalary: data1.minSalary,
        skillsRequired: x,
        jobPostedDate: data1.jobPostedDate,
        address: data1.address,
        endDate: data1.endDate,
        startDate: data1.startDate,
        status: data1.status,
        noOfVacancy: data1.noOfVacancy,
        jobType: data1.jobType,
        selectcurrencyid: data1.selectcurrencyid,
        pvaStatus: data1.pvaStatus,
        industryTypeId: data1.industryTypeId,
        expReq: data1.expReq
    }
    res[counter] = obj1
    return res
}

const allJobs = async (params) => {
    const log = logger.start('job:service:allJobs')
    const check1 = await db.users.findOne({ _id: params.userInfo._id }, { savedJobs: 1 }, { lean: true })    
    const q = await db.users.findOne({ _id: params.userInfo._id }, { location: 1 }, { lean: true })
    var lattitude = await parseFloat(q.location && q.location.coordinates ? q.location.coordinates[0] : 0)
    var longitude = await parseFloat(q.location && q.location.coordinates ? q.location.coordinates[1] : 0)
        //let res=[]
        var data = await db.job.aggregate([
        //     {
        //     $geoNear: {
        //         near: { type: "Point", "coordinates": [lattitude, longitude] },
        //         distanceField: "dist.calculated",
        //         spherical: true,
        //         maxDistance: 9999999999999999999999999999999999999999999999999999999999999999999945545454545545499999666432186.9 //11.111999965975954  radians meters
        //     }
        // },
        { $match : { status : 1 } },
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
                _id: 1,
                jobTitle: 1,
                description: 1,
                maxSalary: 1,
                minSalary: 1,
                disableEligibleStatus: 1,
                address: 1,
                disabilityStatus: 1,
                jobType: 1,
                status:1,
                skillsRequired: 1,
                jobPostedDate: 1,
                "companyId":1,
                "companyName.fullName": 1,
                "companyName.email":1,
                "companyName.companyLogo": 1,
                "companyName.address": 1,
                "companyName.rating.avgRating": 1, //     //company.fullName is the name of the company
                savingStatus: 1,
                "dist.calculated": 1,
                "selectcurrencyid":1,
            }
        },
        // { $sort: { "dist.calculated": 1 } },
        { $sort: { "jobPostedDate": -1 } },
        { $skip: params.skip || 0 },
        { $limit: params.limit || 100000 }
    ])
    //    {
    //res=await jobFormat(data[y],check1)
    const res = await jobFormat(data, check1)
    // var filtered = res.filter((value, index, arr) =>{
    //     return value.companyNames != undefined  ;
    // });
    // const checkCompany = res.forEach((value) => {
    // }) 
    //         res[y]=ret
    //    }
    if (res != "") {

        return res 
    } else {
        return "no result found"
    }
}

// const jobProfile = async (params) => {
//     const log = logger.start('job:service:jobProfile')

//     const check1 = await db.users.findOne({ _id: params.userId }, { savedJobs: 1 }, { lean: true })
 
//     const check2 = await db.users.findOne({ _id: params.userId, /*"appliedJobs.jobId":params.jobId*/ }, { "appliedJobs.jobId": 1 }, { lean: true })
//     var data = await db.job.aggregate([
//         { $match: { _id: { $in: [mongoose.Types.ObjectId(params.jobId)] } } },
//         {
//             $lookup: {
//                 from: "users",
//                 localField: "companyId",
//                 foreignField: "_id",
//                 as: "companyName"
//             }
//         },
//         {
//             $project: {
//                 jobTitle: 1,
//                 description: 1,
//                 maxSalary: 1,
//                 minSalary: 1,
//                 selectcurrencyid:1,
//                 companyId: 1,
//                 jobType: 1,
//                 industryTypeId: 1,
//                 pvaStatus: 1,
//                 startDate: 1,
//                 endDate: 1,
//                 contactPersonId: 1,
//                 skillsRequired: 1,
//                 jobPostedDate: 1,
//                 address: 1,
//                 expReq: 1,
//                 noOfVacancy: 1,
//                 disableEligibleStatus: 1,
//                 selectcurrencyid: 1,
//                 savingStatus: 1,
//                 contactPerson: 1,
//                 "industryTypeName.name": 1,
//                 "companyName._id": 1,
//                 "companyName.fullName": 1,
//                 "companyName.companyLogo": 1,
//                 "companyName.address": 1,//company.fullName is the name of the company
//                 "companyName.contactPerson": 1
//             }
//         }
//     ])

// console.log('data===>',data[0].companyName)
// const industry = await db.industryType.findOne({ _id: data[0].industryTypeId }, { name: 1 })
// const job = await db.jobType.findOne({ _id: data[0].jobType }, { name: 1 })

//     // for updating saving status 
//     if (check1.savedJobs != "" && check1.savedJobs != undefined) {
//         for (var i = 0; i < data.length; i++) {
//             for (var j = 0; j < check1.savedJobs.length; j++) {
//                 if (data[i]._id.toString() === check1.savedJobs[j].toString()) {
//                     data[i].savingStatus = 1
//                     break
//                 } else if (check1.savedJobs[j].toString() !== data[i]._id.toString()) {
//                     data[i].savingStatus = 0
//                 }
//             } 
//         }
//     } else if (check1.savedJobs == "") {

//         for (var i = 0; i < data.length; i++) {
//             data[i].savingStatus = 0
//         }

//     }
//     // FOR CHECKING IF THE USER HAS APPLIED TO THE JOB OR NOT

//     if (check2.appliedJobs.length >0) {

//         for (var i = 0; i < data.length; i++) {

//             for (var j = 0; j < check2.appliedJobs.length; j++) {

//                 if (data[i]._id.toString() === check2.appliedJobs[j].jobId.toString()) {
//                     data[i].isApplied = true
//                     break;
//                 } else if (check2.appliedJobs[j].jobId.toString() !== data[i]._id.toString()) {
//                     data[i].isApplied = false
//                 }
//             }
//         }
//     } else {
//         for (var i = 0; i < data.length; i++) {
//             data[i].isApplied = false
//         }
//     }
//     if (data.length != "" && data[0].companyName[0] != undefined && data[0].companyName[0]._id != undefined && data[0].companyName[0].fullName != undefined && data[0].companyName[0].companyLogo != undefined && 
//     data[0].companyName[0].address.fullAddress != undefined && data[0].companyName[0].address.city) {
//         // for (var i = 0; i < data.length; i++) {
//             data[0].companyId = data[0].companyName[0]._id
//             data[0].companyNames = data[0].companyName[0].fullName
//             data[0].companyLogo = data[0].companyName[0].companyLogo
//             data[0].companyFullAddress = data[0].companyName[0].address.fullAddress
//             data[0].companyCity = data[0].companyName[0].address.city
//             // data[0].jobType = data[0].jobType[0].jobType.name
//         // }
//     }
//     let res = []
//     let counter = 0
//     var obj1 = {
//         jobTitle: "",
//         minSalary: 0,
//         description: "",
//         maxSalary: 0,
//         skillsRequired: [],
//         jobPostedDate: 0,
//         savingStatus: 0,
//         disableEligibleStatus: 0,
//         jobType: " ",
//         companyNames: " ",
//         companyLogo: " ",
//         companyFullAddress: "",
//         companyCity: "",
//         pvaStatus: "",
//         expReq: "",
//         noOfVacancy: "",
//         contactPerson: [],
//         selectcurrencyid: "",
//         isApplied: false,
//         startDate: "",
//         endDate: "",
//         industryTypeId: {}
//     }

//     data[0].industryTypeId = await db.industryType.findOne({ _id: data[0].industryTypeId }, { name: 1 })
    
//     //for(var i=0;i<data.length;i++)
//     for (counter = 0; counter < data.length; counter++)
//     // //await data.forEach(async (obj) =>
//     {
//         const x = await db.skills.find({ "_id": { $in: data[counter].skillsRequired } }, { name: 1, _id: 1 }, { lean: true })   
//         obj1 = {

//             jobTitle: data[counter].jobTitle,
//             description: data[counter].description,
//             maxSalary: data[counter].maxSalary,
//             minSalary: data[counter].minSalary,
//             skillsRequired: x,
//             jobPostedDate: data[counter].jobPostedDate,
//             savingStatus: data[counter].savingStatus,
//             disableEligibleStatus: data[counter].disableEligibleStatus,
//             jobType: data[counter].jobType,
//             companyId: data[counter].companyId,
//             companyNames: data[counter].companyNames,
//             companyLogo: data[counter].companyLogo,
//             companyFullAddress: data[counter].companyFullAddress,
//             companyCity: data[counter].companyCity,
//             pvaStatus: data[counter].pvaStatus,
//             expReq: data[counter].expReq,
//             noOfVacancy: data[counter].noOfVacancy,
//             selectcurrencyid: data[counter].selectcurrencyid,
//             isApplied: data[counter].isApplied,
//             startDate: data[counter].startDate,
//             endDate: data[counter].endDate,
//             industryTypeId: data[counter].industryTypeId

//         }
//         // console.log('data[counter].companyName[counter]===>',data[counter].companyName[counter].contactPerson)
//         if(data[counter].companyName[counter] != undefined  && !data[counter].companyName[counter].contactPerson && data[counter].companyName[counter].contactPerson  != undefined){
//             console.log('=========>')
//             obj1[contactPerson] = data[counter].companyName[counter].contactPerson;
//         }
//         res[counter] = obj1

//         await db.users.findOneAndUpdate({ _id: params.companyId }, { $inc: { "graphData.jobListingEngagement": 1 } }, { new: true })

// res.push({"jobType":job})
// res.push({"industry":industry})
// console.log('res===>',res)
// return res
//     }
//     //)
//     // return data
// }

const jobProfile = async (params) => {
    const log = logger.start('job:service:jobProfile')

    const check1 = await db.users.findOne({ _id: params.userId }, { savedJobs: 1 }, { lean: true })
 
    const check2 = await db.users.findOne({ _id: params.userId, /*"appliedJobs.jobId":params.jobId*/ }, { "appliedJobs.jobId": 1 }, { lean: true })
    var data = await db.job.aggregate([
        { $match: { _id: { $in: [mongoose.Types.ObjectId(params.jobId)] } } },
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
                companyId: 1,
                jobType: 1,
                industryTypeId: 1,
                pvaStatus: 1,
                startDate: 1,
                endDate: 1,
                contactPersonId: 1,
                skillsRequired: 1,
                jobPostedDate: 1,
                address: 1,
                expReq: 1,
                noOfVacancy: 1,
                disableEligibleStatus: 1,
                savingStatus: 1,
                contactPerson: 1,
                "industryTypeName.name": 1,
                "companyName._id": 1,
                "companyName.fullName": 1,
                "companyName.companyLogo": 1,
                "companyName.address": 1,//company.fullName is the name of the company
                "companyName.contactPerson": 1
            }
        }
    ])


const industry = await db.industryType.findOne({ _id: data[0].industryTypeId }, { name: 1 })
const job = await db.jobType.findOne({ _id: data[0].jobType }, { name: 1 })

    // for updating saving status 
    if (check1.savedJobs != "" && check1.savedJobs != undefined) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < check1.savedJobs.length; j++) {
                if (data[i]._id.toString() === check1.savedJobs[j].toString()) {
                    data[i].savingStatus = 1
                    break
                } else if (check1.savedJobs[j].toString() !== data[i]._id.toString()) {
                    data[i].savingStatus = 0
                }
            } 
        }
    } else if (check1.savedJobs == "") {

        for (var i = 0; i < data.length; i++) {
            data[i].savingStatus = 0
        }

    }
    // FOR CHECKING IF THE USER HAS APPLIED TO THE JOB OR NOT

    if (check2.appliedJobs.length >0) {

        for (var i = 0; i < data.length; i++) {

            for (var j = 0; j < check2.appliedJobs.length; j++) {

                if (data[i]._id.toString() === check2.appliedJobs[j].jobId.toString()) {
                    data[i].isApplied = true
                    break;
                } else if (check2.appliedJobs[j].jobId.toString() !== data[i]._id.toString()) {
                    data[i].isApplied = false
                }
            }
        }
    } else {
        for (var i = 0; i < data.length; i++) {
            data[i].isApplied = false
        }
    }
    if (data.length != "" && data[0].companyName[0]._id != undefined && data[0].companyName[0].fullName != undefined && data[0].companyName[0].companyLogo != undefined && 
    data[0].companyName[0].address.fullAddress != undefined && data[0].companyName[0].address.city) {
        // for (var i = 0; i < data.length; i++) {
            data[0].companyId = data[0].companyName[0]._id
            data[0].companyNames = data[0].companyName[0].fullName
            data[0].companyLogo = data[0].companyName[0].companyLogo
            data[0].companyFullAddress = data[0].companyName[0].address.fullAddress
            data[0].companyCity = data[0].companyName[0].address.city
            // data[0].jobType = data[0].jobType[0].jobType.name
        // }
    }
    let res = []
    let counter = 0
    var obj1 = {
        jobTitle: "",
        minSalary: 0,
        "selectcurrencyid":"",
        description: "",
        maxSalary: 0,
        skillsRequired: [],
        jobPostedDate: 0,
        savingStatus: 0,
        disableEligibleStatus: 0,
        jobType: " ",
        companyNames: " ",
        companyLogo: " ",
        companyFullAddress: "",
        companyCity: "",
        pvaStatus: "",
        expReq: "",
        noOfVacancy: "",
        contactPerson: [],
        isApplied: false,
        startDate: "",
        endDate: "",
        industryTypeId: {}
    }

    data[0].industryTypeId = await db.industryType.findOne({ _id: data[0].industryTypeId }, { name: 1 })
    
    //for(var i=0;i<data.length;i++)
    for (counter = 0; counter < data.length; counter++)
    // //await data.forEach(async (obj) =>
    {
        const x = await db.skills.find({ "_id": { $in: data[counter].skillsRequired } }, { name: 1, _id: 1 }, { lean: true })   
        obj1 = {

            jobTitle: data[counter].jobTitle,
            description: data[counter].description,
            maxSalary: data[counter].maxSalary,
            minSalary: data[counter].minSalary,
            selectcurrencyid: data[counter].selectcurrencyid,
            skillsRequired: x,
            jobPostedDate: data[counter].jobPostedDate,
            savingStatus: data[counter].savingStatus,
            disableEligibleStatus: data[counter].disableEligibleStatus,
            jobType: data[counter].jobType,
            companyId: data[counter].companyId,
            companyNames: data[counter].companyNames,
            companyLogo: data[counter].companyLogo,
            companyFullAddress: data[counter].companyFullAddress,
            companyCity: data[counter].companyCity,
            pvaStatus: data[counter].pvaStatus,
            expReq: data[counter].expReq,
            noOfVacancy: data[counter].noOfVacancy,
            contactPerson: data[counter].companyName[counter].contactPerson,
            isApplied: data[counter].isApplied,
            startDate: data[counter].startDate,
            endDate: data[counter].endDate,
            industryTypeId: data[counter].industryTypeId

        }
        res[counter] = obj1

        await db.users.findOneAndUpdate({ _id: params.companyId }, { $inc: { "graphData.jobListingEngagement": 1 } }, { new: true })

res.push({"jobType":job})
res.push({"industry":industry})
return res
    }
    //)
    // return data
}


const searchByJobType = async (params) => {
    const log = logger.start(`job:service:searchByJobType`);
    let invitedCandidates = [], 
        interviewings = [], 
        interviewingRequests = [], 
        appliedJobs = [], 
        offereds = [],
        allJobs = [];

    if (params.jobType == "saved") {
        const savedJobs = await db.job.find({ _id: { $in: params.userInfo.savedJobs }, jobTitle: new RegExp(params.jobTitle,"i") }, { maxSalary: 1, companyId: 1, minSalary: 1, selectcurrencyid:1,jobTitle: 1, jobPostedDate: 1, skillsRequired: 1 }).populate({path:"companyId", select: "fullName companyLogo address "}).lean();
        for (const element of savedJobs) {
            console.log('element.companyId.address.city',element.companyId)
            if(element.companyId.address != null && element.companyId.address != '' && element.companyId.address != undefined ){
                console.log('inside the if ')
                element.companyCity = element.companyId.address.city
            }
            if(element.companyId.companyLogo != null && element.companyId.companyLogo != '' && element.companyId.companyLogo != undefined ){
                console.log('inside the if==><<==== ')
                element.companyLogo = element.companyId.companyLogo
            }
            if(element.companyId.fullName != null && element.companyId.fullName != '' && element.companyId.fullName != undefined ){
                console.log('inside the if==><<====111 ')
                element.companyNames = element.companyId.fullName;
            }
            let skillsRequired = element.skillsRequired;
            element.skillsRequired = [];
            for (const skill of skillsRequired) {

                let skillData = await db.skills.findOne({ _id: skill }, { name: 1 }).lean();
                element.skillsRequired.push(skillData);
            }
            delete element.companyId;
        }
        log.end();
        return savedJobs;
    } else if (params.jobType == "invited") {
        await params.userInfo.jobInvites.forEach(async element => {
            let invitedCandidate = await db.job.findOne({ _id: element.jobId, jobTitle: new RegExp(params.jobTitle,"i") }, { maxSalary: 1, companyId: 1, minSalary: 1,selectcurrencyid:1, jobTitle: 1, jobPostedDate: 1, skillsRequired: 1 }).populate({path:"companyId", select: "fullName companyLogo address "});
            invitedCandidates.push(invitedCandidate);
        });
        for (const element of invitedCandidates) {
            element.companyCity = element.companyId.address.city
            element.companyFullAddress = element.companyId.address.fullAddress  
            element.companyLogo = element.companyId.companyLogo
            element.companyNames = element.companyId.fullName
            let skillsRequired = element.skillsRequired;
            element.skillsRequired = [];
            for (const skill of skillsRequired) {

                let skillData = await db.skills.findOne({ _id: skill }, { name: 1 }).lean();
                element.skillsRequired.push(skillData);
            }
            delete element.companyId;
        };
        log.end();
        return invitedCandidates;
    } else if (params.jobType == "applied") {
        const data1 = await db.users.aggregate([
            { "$match": { "email": params.userInfo.email} },
            { "$unwind": "$appliedJobs" },
            { "$lookup": {
                from: "jobs",
                localField: "jobId",
                foreignField:"_id",
                 as: "jobDetails"
              }},
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
    //     var data = await db.users.aggregate([{ $match: { jobTitle: new RegExp(params.jobTitle, "i") } }, //is deleted check or job closed checks
    //     {
    //         $lookup: {
    //             from: "jobs",
    //             localField: "companyId",
    //             foreignField: "_id",
    //             as: "companyName"
    //         }
    //     },
    //     {
    //         $project: {
    //             jobTitle: 1,
    //             description: 1,
    //             maxSalary: 1,
    //             minSalary: 1,
    //             skillsRequired: 1,
    //             jobPostedDate: 1,
    //             "companyName.fullName": 1,
    //             "companyName.companyLogo": 1,
    //             "companyName.address": 1,
    //             savingStatus: 1,
    //             disableEligibleStatus: 1,
    //             jobType: 1,
    //         }
    //     },
    //     //{$sort:{maxSalary:-1}},
    //     //    {$skip:params.query.skip||0},
    //     //    {$limit:params.query.limit||10}
    // ]);
        await params.userInfo.appliedJobs.forEach(async element => {
            if(element.applicationStatus == 1) {
                let appliedJob = await db.job.findOne({ _id: element.jobId, jobTitle: new RegExp(params.jobTitle,"i") }, { maxSalary: 1, companyId: 1, minSalary: 1,selectcurrencyid:1, jobTitle: 1, jobPostedDate: 1, skillsRequired: 1 }).populate({path:"companyId", select: "fullName companyLogo address "}).lean();
                appliedJobs.push(appliedJob);
            }
        });
        await appliedJobs.forEach(async element => {
            element.companyCity = element.companyId.address.city
            element.companyFullAddress = element.companyId.address.fullAddress  
            element.companyLogo = element.companyId.companyLogo
            element.companyNames = element.companyId.fullName
            let skillsRequired = element.skillsRequired;
            element.skillsRequired = [];
            for (const skill of skillsRequired) {
                let skillData = await db.skills.findOne({ _id: skill }, { name: 1 }).lean();
                element.skillsRequired.push(skillData);
            }
            delete element.companyId;
        });

        log.end();
        console.log('appliedJobs---------->',appliedJobs)

        return appliedJobs;
    } else if (params.jobType == "interviewingRequests") {
        await params.userInfo.appliedJobs.forEach(async element => {
            if(element.applicationStatus == 3) {
                let interviewingRequest = await db.job.findOne({ _id: element.jobId, jobTitle: new RegExp(params.jobTitle,"i") }).lean();
                interviewingRequests.push(interviewingRequest);
            }
        });
        log.end();
        console.log('interviewingRequests---------->',interviewingRequests)
        return interviewingRequests;
    } else if (params.jobType == "interviewing") {
        await params.userInfo.appliedJobs.forEach(async element => {
            if(element.applicationStatus == 4) {
                let interviewing = await db.job.findOne({ _id: element.jobId, jobTitle: new RegExp(params.jobTitle,"i") }, { maxSalary: 1, companyId: 1, minSalary: 1,selectcurrencyid:1, jobTitle: 1, jobPostedDate: 1, skillsRequired: 1 }).populate({path:"companyId", select: "fullName companyLogo address "}).lean();
                interviewings.push(interviewing);
            }
        });
        await interviewings.forEach(async element => {
            element.companyCity = element.companyId.address.city
            element.companyFullAddress = element.companyId.address.fullAddress
            element.companyLogo = element.companyId.companyLogo
            element.companyNames = element.companyId.fullName
            let skillsRequired = element.skillsRequired;
            element.skillsRequired = [];
            for (const skill of skillsRequired) {
                let skillData = await db.skills.findOne({ _id: skill }, { name: 1 }).lean();
                element.skillsRequired.push(skillData);
            }
            delete element.companyId;
        });
        log.end();
        console.log('interviewings---------->',interviewings)
        return interviewings;
    } else if (params.jobType == "offered") {
        await params.userInfo.appliedJobs.forEach(async element => {
            if(element.applicationStatus == 5) {
                let offered = await db.job.findOne({ _id: element.jobId, jobTitle: new RegExp(params.jobTitle,"i") }, { maxSalary: 1, companyId: 1, minSalary: 1,selectcurrencyid:1, jobTitle: 1, jobPostedDate: 1, skillsRequired: 1 }).populate({path:"companyId", select: "fullName companyLogo address "}).lean();
                offereds.push(offered);
            }
        });
        await offereds.forEach(async element => {
            element.companyCity = element.companyId.address.city
            element.companyFullAddress = element.companyId.address.fullAddress  
            element.companyLogo = element.companyId.companyLogo
            element.companyNames = element.companyId.fullName
            let skillsRequired = element.skillsRequired;
            element.skillsRequired = [];
            for (const skill of skillsRequired) {

                let skillData = await db.skills.findOne({ _id: skill }, { name: 1 }).lean();
                element.skillsRequired.push(skillData);
            }
            delete element.companyId;
        });
        log.end();
        console.log('offereds---------->',offereds);
        return offereds;
    } else {        
        allJobs = await db.job.find({ jobTitle: new RegExp(params.jobTitle,"i")}, { maxSalary: 1, companyId: 1, minSalary: 1,selectcurrencyid:1, jobTitle: 1, jobPostedDate: 1, skillsRequired: 1 }).populate({path:"companyId", select: "fullName companyLogo address "}).lean();
        await allJobs.forEach(async element => {
            element.companyCity = element.companyId.address.city
            element.companyFullAddress = element.companyId.address.fullAddress  
            element.companyLogo = element.companyId.companyLogo
            element.companyNames = element.companyId.fullName
            let skillsRequired = element.skillsRequired;
            element.skillsRequired = [];
            for (const skill of skillsRequired) {

                let skillData = await db.skills.findOne({ _id: skill }, { name: 1 }).lean();
                element.skillsRequired.push(skillData);
            }
            delete element.companyId;
        });
        log.end();
        console.log('allJobs---------->',allJobs);
        return allJobs;
    }
}

const searchByJobPosition = async (params) => {
    const log = logger.start(`job:service:searchByJobPosition`)

    // const data= await db.job.find({"jobTitle":  new RegExp(params.jobTitle,"i")}) 

    const check1 = await db.users.findOne({ _id: params.userInfo._id }, { savedJobs: 1 }, { lean: true });
    let res = []
    var data = await db.job.aggregate([{ $match: { jobTitle: new RegExp(params.jobTitle, "i") } }, //is deleted check or job closed checks
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
            }
        },
        //{$sort:{maxSalary:-1}},
        //    {$skip:params.query.skip||0},
        //    {$limit:params.query.limit||10}
    ]);

    let data1 = []
    for (var x = 0; x < data.length; x++) {
        data1 = await db.job.findOneAndUpdate({ _id: data[x]._id }, { $inc: { searchNumber: 1 } })
    };

    res = await jobFormat(data, check1)
    log.end()
    if (res != "") {
        return res
    } else {
        return "no result found"
    }
}

const jobFilters = async (params) => {
    let res;
    const log = logger.start(`job:service:jobFilters`)
    const check1 = await db.users.findOne({ _id: params.userInfo._id }, { savedJobs: 1 }, { lean: true })
    if (params.showResultType == 1) {
        var obj = {
            _id: []
        }

        if (params.industryTypeId != "") {
            obj.industryTypeId = { $eq: params.industryTypeId }
        }
        // else //if(params.industryType)
        // {
        //     let a=await db.users.findOne({_id:params.userInfo._id},{industryTypeId:1},{lean:true})
        //      obj.industryTypeId=a.industryTypeId
        // }

        if (params.minSalary !== "" && params.maxSalary !== "") {
            //obj.minSalary=params.minSalary
            //obj={minSalary:{$eq:params.minSalary}}
            obj.minSalary = { $gte: params.minSalary }
            obj.maxSalary = { $lte: params.maxSalary }
            console.log('params.minSalary',params.minSalary)
            console.log('params.maxSalary',params.maxSalary)
        }

        if (params.expReqLowerLimit !== "" && params.expReqUpperLimit !== "") {
            obj.expReq = { $gte: params.expReqLowerLimit, $lte: params.expReqUpperLimit }
        }
        if (params.jobType != "") {
            obj.jobType = { $eq: params.jobType }
            // obj.jobType=new RegExp(params.jobType,"i")
        }
        if (params.skillsRequired != "") {
            obj.skillsRequired = { $in: params.skillsRequired }
        }

        if (params.disableEligibleStatus != "") {
            obj.disableEligibleStatus = { $eq: params.disableEligibleStatus }
        }

        // // if the raitng is null 

        // const ratingCheck = await db.job.aggregate([{
        //         $lookup: {
        //             from: "users",
        //             localField: "companyId",
        //             foreignField: "_id",
        //             as: "companyName"
        //         }
        //     },
        //     { $project: { _id: 1, "companyName.rating.averageRating": 1 } }
        // ])
        // var ratingId = []
        // let abc = 0
        // for (let z = 0; z < ratingCheck.length; z++) {

        //     if (ratingCheck[z].companyName[0].rating.averageRating >= params.rating) {
        //         ratingId[abc] = ratingCheck[z]._id
        //         abc++
        //     }
        // }
        // //var arr1={}
        // // arr1+=ratingId
        // obj._id = { $in: ratingId }


        if (params.location !== "") {
            let lattitude = await parseFloat(params.location.coordinates[0])
            let longitude = await parseFloat(params.location.coordinates[1])
            var locationId = await db.job.aggregate([{
                    $geoNear: {
                        near: { type: "point", "coordinates": [lattitude, longitude] },
                        distanceField: "dist.calculated",
                        spherical: true,
                        maxDistance: params.maxDistance * 1609.344 //11.111999965975954
                    }
                },
                { $project: { _id: 1 } } //,"dist.calculated":1}}
            ])

            let arr = []
            for (var xyz = 0; xyz < locationId.length; xyz++) {
                arr[xyz] = locationId[xyz]._id
            }
             if (locationId == "") {
                obj._id = { $in: [] }
            } else {
                let def = 0
                let newArr = []
                for (var n = 0; n < locationId.length; n++) {
                        if (locationId[n]._id.toString()) {
                            newArr[def] = locationId[n]._id
                            def++
                        }
                    }
                newArr = newArr.filter(function(item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });
                obj._id = { $in: newArr }
            }
        }
        var search
        obj.status = { $eq: 1 }
        console.log('obj._id',obj)
        // if(params.showResultType==1)
        // {
        search = await db.job.find(obj, { _id: 1 }, { lean: true })
        console.log('search====>',search)
        // const search1=await db.job.find(obj)
        //  }
        let res = []
        var data = []
        for (var y = 0; y < search.length; y++) {
            data[y] = await db.job.aggregate([
                { $match: { _id: { $in: [mongoose.Types.ObjectId(search[y]._id)] } } },
                {
                    $lookup: {
                        from: "users",
                        localField: "companyId",
                        foreignField: "_id",
                        as: "companyName"
                    }
                },
                //{$match:{status:1}},                                                      
                {
                    $project: {
                        jobTitle: 1,
                        description: 1,
                        maxSalary: 1,
                        minSalary: 1,
                        jobType: 1,
                        industryType: 1,
                        pvaStatus: 1,
                        startDate: 1,
                        endDate: 1,
                        contactPersonId: 1,
                        disableEligibleStatus: 1,
                        skillsRequired: 1,
                        jobPostedDate: 1,
                        address: 1,
                        expReq: 1,
                        noOfVacancy: 1,
                        jobPostedDate: 1,
                        selectcurrencyid: 1,
                        disableEligibleStatus: 1,
                        "companyName.fullName": 1,
                        "companyName.companyLogo": 1,
                        "companyName.address": 1 //company.fullName is the name of the company 
                            ,
                        savingStatus: 1,
                        "companyName.contactPerson": 1
                    }
                }
            ])
            //})
            //let res=[]
            let ret = {}
            //    if(data[y]!="")
            //    {
            ret = await jobFormat(data[y], check1)
            // }
            //   if(ret[0]!==null)
            //   { 
            if (y < search.length - 1) {

                res[y] = ret[0]
            } else if (y == search.length - 1) {
                res[y] = ret[0]
                return res
            }
            //}
            // //})
        }
    } else if (params.showResultType == 2) {
        console.log('type 2')
        
        // var industry = []
        // industry = await db.users.findOne({ _id: params.userInfo._id }, { industryTypeId: 1 }, { lean: true })
        var obj = {}
        var finalResult =[];
        // var userSkills = []
        // userSkills = await db.users.findOne({ _id: params.userInfo._id }, { skills: 1 }, { lean: true })
        // obj.skillsRequired = { $in: userSkills.skills }
        obj.status = { $eq: 1 }
        const search2 = await db.job.find(obj, { _id: 1 }, { lean: true })
        console.log('serach2',search2)
        for (var y = 0; y < search2.length; y++) {
            console.log('serach2===>',search2[y]._id)
            var data = await db.job.aggregate([
                { $match: { _id: { $in: [mongoose.Types.ObjectId(search2[y]._id)] } } },
                {
                    $lookup: {
                        from: "users",
                        localField: "companyId",
                        foreignField: "_id",
                        as: "companyName"
                    }
                },
                //{$match:{status:1}},                                                     
                {
                    $project: {
                        jobTitle: 1,
                        description: 1,
                        maxSalary: 1,
                        minSalary: 1,
                        jobType: 1,
                        industryType: 1,
                        pvaStatus: 1,
                        startDate: 1,
                        endDate: 1,
                        contactPersonId: 1,
                        disableEligibleStatus: 1,
                        skillsRequired: 1,
                        jobPostedDate: 1,
                        address: 1,
                        expReq: 1,
                        noOfVacancy: 1,
                        jobPostedDate: 1,
                        selectcurrencyid: 1,
                        disableEligibleStatus: 1,
                        "companyName.fullName": 1,
                        "companyName.companyLogo": 1,
                        "companyName.address": 1, //company.fullName is the name of the company 
                        savingStatus: 1,
                        "companyName.contactPerson": 1
                    }
                }
            ])
             res = await jobFormat(data, check1)
            console.log('res',res)
            return res
        }
    }
    search = []
    console.log('serararara',search)
    console.log('res====>',res)
    if (search != "") {
        return search
    }
    else if(data="")
    {
        return "no result found"
    }
    else {
        return "no result found"
    }

}

const jobFormat = async (data, check1) => {
    if (check1.savedJobs == "" && check1.savedJobs == undefined) {
        for (var i = 0; i < data.length; i++) {
            data[i].savingStatus = 0
        }
    }
    else if (check1.savedJobs != "" && check1.savedJobs != undefined) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < check1.savedJobs.length; j++) {
                if (data[i]._id.toString() === check1.savedJobs[j].toString()) {
                    data[i].savingStatus = 1;
                    break
                } else if (check1.savedJobs[j].toString() !== data[i]._id.toString()) {
                    data[i].savingStatus = 0
                }
            }
        }
    } 

    if (data.length != "") {
        for (var i = 0; i < data.length; i++) {
            if(data[i] && data[i].companyName && data[i].companyName.length > 0) {
                data[i].companyNames = data[i].companyName[0].fullName  //after using for loop api stucks here
                data[i].companyLogo = data[i].companyName[0].companyLogo
                if(data[i].companyName[0].address) {
                    data[i].companyFullAddress = data[i].companyName[0].address.fullAddress
                    data[i].companyCity = data[i].companyName[0].address.city
                }
            }
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
        jobType: " ",
        companyNames: " ",
        companyLogo: " ",
        companyFullAddress: "",
        companyCity: "",
        selectcurrencyid:""
    }

    for (counter = 0; counter < data.length; counter++)
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
            selectcurrencyid: data[counter].selectcurrencyid,
            disableEligibleStatus: data[counter].disableEligibleStatus,
            jobType: data[counter].jobType,
            companyNames: data[counter].companyNames,
            companyLogo: data[counter].companyLogo,
            companyFullAddress: data[counter].companyFullAddress,
            companyCity: data[counter].companyCity

        }
        res[counter] = obj1;
    }
    return res;
}

const popularSearch = async (params) => {
    const log = logger.start('job:service:popularSearch')
    const data = await db.job.find({}, { jobTitle: 1, searchNumber: 1 }).limit(7).sort({ searchNumber: -1 })
    return data
}


const fetchPostedJobs = async (params) => {
    const log = logger.start('job:service:fetchPostedJobs')
    let data1;
    // updating the job status by comparing current timestamp with the end date timestamp
    const data = await db.job.find({ status: params.status, companyId: params.userId}, { _id: 1, status: 1, endDate: 1 }, { lean: true })
    let currentTime = moment().unix()
    for (let i = 0; i < data.length; i++) {
        if (data[i].endDate <= currentTime) {
            await db.job.findOneAndUpdate({ _id: data[i]._id }, { status: 2 })
        }
    }
    if(params.status == 4) {
      data1   = await db.job.find({ status: params.status, companyId: params.userId, isDeleted: true  }, { _id: 1, status: 1, address: 1,selectcurrencyid: 1, jobPostedDate: 1, jobTitle: 1, startDate: 1, skillsRequired: 1, minSalary: 1, maxSalary: 1, endDate: 1 }, { lean: true }).sort({ jobPostedDate: params.sortingType })    
    }
    else{
        data1 = await db.job.find({ status: params.status, companyId: params.userId, isDeleted: false  }, { _id: 1, status: 1, address: 1, selectcurrencyid: 1, jobPostedDate: 1, jobTitle: 1, startDate: 1, skillsRequired: 1, minSalary: 1, maxSalary: 1, endDate: 1 }, { lean: true }).sort({ jobPostedDate: params.sortingType })
    } 
    let res = []
    let obj1 = {
        _id: "",
        status: 0,
        address: "",
        jobTitle: "",
        startDate: 0,
        skillsRequired: [],
        minSalary: 0,
        maxSalary: 0,
        endDate: 0,
        selectcurrencyid: 0,
        jobPostedDate: 0

    }
    let counter = 0
    // for(let j=0;j<data1.length;j++)
    // {
    //     for(let k=0;k<data[j].skillsRequired.length;K++)
    //     {
    //         if()
    //     }
    // }
    for (counter = 0; counter < data1.length; counter++)
    //await data.forEach(async (obj) =>
    {
        const x = await db.skills.find({ "_id": { $in: data1[counter].skillsRequired } }, { name: 1, _id: 1 }, { lean: true })

        obj1 = {
            _id: data1[counter]._id,
            jobTitle: data1[counter].jobTitle,
            //description:data[counter].description,
            maxSalary: data1[counter].maxSalary,
            minSalary: data1[counter].minSalary,
            skillsRequired: x,
            jobPostedDate: data1[counter].jobPostedDate,
            address: data1[counter].address,
            endDate: data1[counter].endDate,
            startDate: data1[counter].startDate,
            status: data1[counter].status,
            selectcurrencyid: data1[counter].selectcurrencyid,
            //savingStatus:data[counter].savingStatus,
            //disableEligibleStatus:data[counter].disableEligibleStatus,
            //jobType:data[counter].jobType,
            //companyNames:data[counter].companyNames,
            //companyLogo:data[counter].companyLogo,
            //companyFullAddress:data[counter].companyFullAddress,
            //companyCity:data[counter].companyCity
        }
        res[counter] = obj1
        // res.push(obj1);
        //counter ++
    }
    //)
    log.end()
    return res
    //})
    //}
    //     return data1
}

const postDraftJob = async (params) => {
    const log = logger.start('job:service:postDraftJob')
    //close the job manually or close the job on the expiry date of the job
    const data = await db.job.findOneAndUpdate({ _id: params.jobId, companyId: params.userInfo }, { status: 1 })
    return data
}

const fetchAllCandidates = async (params) => {
    const log = logger.start('job:service:fetchAllCandidates')
    let count = 0
    const check1 = await db.job.findOne({ _id: params.jobId /*,"appliedCandidates.applicationStatus":{$in:[1,2,3,4,5]}*/ }, { appliedCandidates: 1 }, { lean: true })
    let Ids = []
    if(check1) {
        for (let i = 0; i < check1.appliedCandidates.length; i++) {
            if ([1, 2, 3, 4, 5, 6, 8].includes(check1.appliedCandidates[i].applicationStatus)) {
                let candidateInfo = {
                    _id: check1.appliedCandidates[i].candidateId,
                    pvaId: check1.appliedCandidates[i].pvaId
                }
                // Ids[count] = check1.appliedCandidates[i].candidateId;
                Ids[count] = candidateInfo;
                count++;
            }
        }
    }
    let res = []
    let obj = {}
    let counter = 0
    let check2 = {}
    let obj1 = {}
    let x

    for (let j = 0; j < Ids.length; j++) {
        check2 = await db.users.findOne({ _id: Ids[j]._id }, { appliedJobs: 1 }, { lean: true })
        for (let x = 0; x < check2.appliedJobs.length; x++) {
            if (check2.appliedJobs[x].jobId.toString() == params.jobId.toString()) {
                obj1 = check2.appliedJobs[x];
            }
        }
        obj = await db.users.findOne({ _id: Ids[j] }, { fullName: 1, totalExperience: 1, profilePicId: 1, isWorking: 1, currentPositionId: 1, employmentInfo: 1, document: 1 }, { lean: true })
        // if (obj.currentPositionId != "") {
        //     x = await db.currentPosition.findOne({ "_id": obj.currentPositionId }, { name: 1, _id: 1 }, { lean: true })
        // }
        //     delete data[counter]["industryTypeId"]
        //     data[counter]["industryTypeId"]=obj1
        delete obj["currentPositionId"]
        obj.currentPosition = obj.currentPositionId
        res[counter] = obj
        res[counter].candidate = obj1
        res[counter].pvaId = Ids[j].pvaId
        counter++
    }
    return res
}


const fetchUserProfile = async (id,params) => {
    const log = logger.start('job:service:fetchUserProfile')
    let counter = 0
    let data1;
    const data = await db.users.findOne({ _id: params.empId },{document:1})   
    if(data.document.certificateId.length >0 && data.document.pvrId != '' && data.document.cvId != '' && data.document.cvId != null) {
         data1 = await db.users.findOne({ _id: params.empId }, { userRole: 1, bio: 1, _id: 1, fullName: 1, profilePicId: 1, address: 1, isWorking: 1, contactNumber: 1, gender: 1, dob: 1, disability: 1, qualification: 1, employmentInfo: 1, "document.cvId": 1, "document.pvrId": 1, "document.certificateId": 1, email: 1, skills: 1, industryTypeId: 1, languageId: 1, currentPositionId: 1, appliedJobs:1 }, { lean: true })
            .populate({ path: "document.pvrId", model: "files", select: "fileExtension thumbnail fileOriginalName" })
            .populate({ path: "document.cvId", model: "files", select: "fileExtension fileOriginalName" })
            .populate({ path: "document.certificateId", model: "files", select: "fileExtension fileOriginalName" })
    }
    if(data.document.certificateId.length >0 && data.document.pvrId != ''&& data.document.pvrId != null && data.document.cvId == '' || data.document.cvId == null) {
        data1 = await db.users.findOne({ _id: params.empId }, { userRole: 1, bio: 1, _id: 1, fullName: 1, profilePicId: 1, address: 1, isWorking: 1, contactNumber: 1, gender: 1, dob: 1, disability: 1, qualification: 1, employmentInfo: 1, "document.pvrId": 1, "document.certificateId": 1, email: 1, skills: 1, industryTypeId: 1, languageId: 1, currentPositionId: 1, appliedJobs:1 }, { lean: true })
        .populate({ path: "document.pvrId", model: "files", select: "fileExtension thumbnail fileOriginalName" })
        .populate({ path: "document.certificateId", model: "files", select: "fileExtension fileOriginalName" })
    }
    if(data.document.certificateId.length = 0 && data.document.pvrId == '' && data.document.cvId == '' && data.document.pvrId == undefined 
    && data.document.cvId == undefined && data.document.pvrId == null && data.document.cvId == null) {
        data1 = await db.users.findOne({ _id: params.empId }, { userRole: 1, bio: 1, _id: 1, fullName: 1, profilePicId: 1, address: 1, isWorking: 1, contactNumber: 1, gender: 1, dob: 1, disability: 1, qualification: 1, employmentInfo: 1, "document.pvrId": 1, "document.certificateId": 1, email: 1, skills: 1, industryTypeId: 1, languageId: 1, currentPositionId: 1, appliedJobs:1 }, { lean: true })
    }
    // invitedCandidates.candidateId
    //const data1 = await db.users.findOne({ _id: params.empId }, { userRole: 1, bio: 1, _id: 1, fullName: 1, profilePicId: 1, address: 1, isWorking: 1, contactNumber: 1, gender: 1, dob: 1, disability: 1, qualification: 1, employmentInfo: 1, "document.cvId": 1, "document.pvrId": 1, "document.certificateId": 1, "document.pvaId": 1, email: 1, skills: 1, industryTypeId: 1, languageId: 1, currentPositionId: 1, appliedJobs:1 }, { lean: true })
    // .populate({ path: "document.pvrId", model: "files", select: "fileExtension thumbnail fileOriginalName" })
    // .populate({ path: "document.cvId", model: "files", select: "fileExtension fileOriginalName" })
    // .populate({ path: "document.certificateId", model: "files", select: "fileExtension fileOriginalName" })
    // .populate({ path: "document.pvaId", model: "files", select: "fileExtension thumbnail fileOriginalName" })
    //console.log('data111',data1)

    const count = await db.job.countDocuments({"invitedCandidates.candidateId":id})
    var count1
    if(count>0)
    {
        count1 =1
    } 
    console.log('case1case1case1case1**********>',data1)
    let dataToSave = {}
    if (data1.userRole == "employee"){
        dataToSave = { $inc: { "graphData.cvViewed": 1 } }
    }
    else {
        dataToSave = { $inc: { "graphData.companyPageView": 1 } }
    }
 
    await db.users.findOneAndUpdate({ _id: params.userId }, dataToSave)
    await db.users.findOne({_id : params.userId,})
 
    let retObj = {
        _id: "",
        fullName: "",
        profilePicId: "",
        address: {},
        isWorking: "",
        contactNumber: 0,
        gender: "",
        dob: 0,
        disability: {},
        qualification: {},
        employmentInfo: {},
        cvId: "",
        pvaId: [],
        certificateId: [],
        email: "",
        skills: [],
        industryType: {},
        languagesKnown: [],
        currentPosition: "",
        pvrId: "",
        appliedJobs:count1
    }
    let w ;
    if(typeof(data1.currentPositionId) == "string") {
        w = data1.currentPositionId;
    }
    else if(data1.currentPositionId == undefined){
        w = await db.currentPosition.findOne({ _id: { $eq: data1.currentPositionId } }, { name: 1 }, { lean: true })
        if(w && w != undefined && w != ''){
            w = w.name;
        }
        else{
            w = '';
        }
    }
    const x = await db.skills.find({ "_id": { $in: data1.skills } }, { name: 1, _id: 1 }, { lean: true })
    const y = await db.languages.find({ "_id": { $in: data1.languageId } }, { name: 1 }, { lean: true })
    const z = await db.industryType.findOne({ "_id": { $eq: data1.industryTypeId } }, { name: 1 }, { lean: true })
    retObj = {
        _id: data1._id,
        email: data1.email,
        dob: data1.dob,
        profilePicId: data1.profilePicId,
        fullName: data1.fullName,
        isWorking: data1.isWorking,
        minSalary: data1.minSalary,
        skills: x,
        contactNumber: data1.contactNumber,
        address: data1.address,
        gender: data1.gender,
        dob: data1.dob,
        disabilty: data1.disability,
        email: data1.email,
        qualification: data1.qualification,
        employmentInfo: data1.employmentInfo,
        pvrId: data1.document.pvrId,
        cvId: data1.document.cvId,
        certificateId: data1.document.certificateId,
        industryType: z,
        languagesKnown: y,
        currentPosition: w,
        bio: data1.bio || "",
        appliedJobs:count1
    }
    console.log('retObjretObjretObj',retObj);
    let res = []
    res[counter] = retObj
    log.end()
    return retObj
}


const fetchShortlistedCandidates = async (params) => {
    const log = logger.start('job:service:fetchShortlistedCandidates')
    let count = 0
    const check1 = await db.job.findOne({ _id: params.jobId /*,"appliedCandidates.applicationStatus":{$in:[1,2,3,4,5]}*/ }, { appliedCandidates: 1 }, { lean: true })
    let Ids = []
    for (let i = 0; i < check1.appliedCandidates.length; i++) {
        if ([2, 3].includes(check1.appliedCandidates[i].applicationStatus)) {

            Ids[count] = check1.appliedCandidates[i].candidateId
            count++
        }
    }
    let res = []
    let obj = {}
    let counter = 0
    let check2 = {}
    let obj1 = {}
    let x
    for (let j = 0; j < Ids.length; j++) {
        check2 = await db.users.findOne({ _id: Ids[j] }, { appliedJobs: 1 }, { lean: true })
        for (let x = 0; x < check2.appliedJobs.length; x++) {
            if (check2.appliedJobs[x].jobId.toString() == params.jobId.toString()) {
                obj1 = check2.appliedJobs[x]
            }
        }

        obj = await db.users.findOne({ _id: Ids[j] }, { fullName: 1, totalExperience: 1, profilePicId: 1, isWorking: 1, currentPositionId: 1, employmentInfo: 1 ,appliedJobs:1 }, { lean: true })

        // if (obj.currentPositionId != "") {
        //     x = await db.currentPosition.findOne({ "_id": obj.currentPositionId }, { name: 1, _id: 1 }, { lean: true })
        // }
        // delete obj["currentPositionId"]
        obj.currentPosition = obj.currentPositionId
        res[counter] = obj
        res[counter].candidate = obj1
        counter++
    }
    return res
}


const fetchInterviewingCandidates = async (params) => {
    const log = logger.start('job:service:fetchInterviewingCandidates')
    let x
    let count = 0
    const check1 = await db.job.findOne({ _id: params.jobId /*,"appliedCandidates.applicationStatus":{$in:[1,2,3,4,5]}*/ }, { appliedCandidates: 1 }, { lean: true })
    let Ids = []
    for (let i = 0; i < check1.appliedCandidates.length; i++) {
        if ([4].includes(check1.appliedCandidates[i].applicationStatus)) {
            Ids[count] = check1.appliedCandidates[i].candidateId
            count++
        }
    }

    let res = []
    let obj = {}
    let counter = 0
    let check2 = {}
    let obj1 = {}

    for (let j = 0; j < Ids.length; j++) {
        check2 = await db.users.findOne({ _id: Ids[j] }, { appliedJobs: 1 }, { lean: true })
        for (let x = 0; x < check2.appliedJobs.length; x++) {
            if (check2.appliedJobs[x].jobId.toString() == params.jobId.toString()) {
                obj1 = check2.appliedJobs[x]
            }
        }

        obj = await db.users.findOne({ _id: Ids[j] }, { fullName: 1, totalExperience: 1, profilePicId: 1, isWorking: 1, currentPositionId: 1, fetchEmployeeReview: 1 }, { lean: true })

        // if (obj.currentPositionId != "") {
        //     x = await db.currentPosition.findOne({ "_id": obj.currentPositionId }, { name: 1, _id: 1 }, { lean: true })
        // }
        // delete obj["currentPositionId"]
        obj.currentPosition = obj.currentPositionId
        res[counter] = obj
        res[counter].candidate = obj1
        counter++
    }
    return res
}

const fetchHiredCandidates = async (params) => {
    const log = logger.start('job:service:fetchHiredCandidates')
    let count = 0
    const check1 = await db.job.findOne({ _id: params.jobId /*,"appliedCandidates.applicationStatus":{$in:[1,2,3,4,5]}*/ }, { appliedCandidates: 1 }, { lean: true })
    let Ids = []
    for (let i = 0; i < check1.appliedCandidates.length; i++) {
        if ([5].includes(check1.appliedCandidates[i].applicationStatus)) {
            Ids[count] = check1.appliedCandidates[i].candidateId
            count++
        }
    }
    let res = []
    let obj = {}
    let counter = 0
    let check2 = {}
    let obj1 = {}
    let x
    for (let j = 0; j < Ids.length; j++) {
        check2 = await db.users.findOne({ _id: Ids[j] }, { appliedJobs: 1 }, { lean: true })
        for (let x = 0; x < check2.appliedJobs.length; x++) {
            if (check2.appliedJobs[x].jobId.toString() == params.jobId.toString()) {
                obj1 = check2.appliedJobs[x]
            }
        }
        obj = await db.users.findOne({ _id: Ids[j] }, { fullName: 1, totalExperience: 1, profilePicId: 1, isWorking: 1, currentPositionId: 1, employmentInfo: 1 }, { lean: true })
        // if (obj.currentPositionId != "") {
        //     x = await db.currentPosition.findOne({ "_id": obj.currentPositionId }, { name: 1, _id: 1 }, { lean: true })
        // }
        // delete obj["currentPositionId"]
        obj.currentPosition = obj.currentPositionId
        res[counter] = obj
        res[counter].candidate = obj1
        counter++
    }
    return res
}


const fetchEmployeeReview = async (params) => {
    const log = logger.start('users:service:fetchEmployeeReview')
    const check1 = await db.users.findOne({ _id: params.empId }, { review: 1 }, { lean: true })
    if (check1.review != "") {
        let counter = 0
        let res = []
        let data1 = {}
        let retObj = {
            companyLogo: "",
            _id: 1,
            reviewDetail: "",
            ratingGiven: 0,
            fullName: "",
            // currentPositionName:"",
        }
        for (let i = 0; i < check1.review.length; i++) {
            const userData = await db.users.findOne({ _id: check1.review[i].from }, { lean: true })
         if(userData && userData !== undefined){
            retObj = {
                companyLogo: userData.companyLogo,
                _id: userData._id,
                reviewDetail: check1.review[i].reviewDetail,
                ratingGiven: check1.review[i].ratingGiven,
                fullName: userData.fullName,
            }
            res[counter] = retObj
            counter++
            }       
        }
        data1.res=res
        data1.counter=counter
        log.end()
        return res //data1
    } else {
        console.log('else')
        return "No reviews"
    }
}


const fetchInterviewingCalendar = async (params) => {
    var arr = []
    var startDate = moment().unix()
    
    const data = await db.job.find({ companyId: params._id, appliedCandidates: { $elemMatch: { "applicationStatus": 4, interviewTime: { $gte: startDate } } } }, { appliedCandidates: 1 })
        .populate({ path: "appliedCandidates.candidateId", select: "fullName" })
    
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].appliedCandidates.length; j++) {

            if (data[i].appliedCandidates[j].interviewTime >= startDate) {

                arr.push({ start: data[i].appliedCandidates[j].interviewTime, title: data[i].appliedCandidates[j].candidateId.fullName })
            }
        }
    }
    return arr
}


const fetchDashboardGraph = async (params) => {
    let keys = [],
        values = []
    const data = await db.users.findOne({ _id: params.userId }, { graphData: 1 })

    if (params.type == 1) {
        keys = ["Profile Page Views", "Job listings views", "PVAs Received", "Invites accepted", "Applications received", "Applications withdrawn"]
        
        // keys = ["Company Page Views", "Engagements with Job Listing", "PVA sent in", "Invites accepted", "Direct applications made", "Applications withdrawn"]
        values = [
            data.graphData.companyPageView || 0,
            data.graphData.jobListingEngagement || 0,
            data.graphData.pvaSentIn || 0,
            data.graphData.inviteesAccepted || 0,
            data.graphData.applicationsMade || 0,
            data.graphData.applicationsWithdraw || 0,
        ]
    } else {
        keys = ["CVs viewed", "PVRs received", "PVAs received", "Msg contacts made", "Interviews invites sent", "Total hired"]
        values = [
            data.graphData.cvViewed || 0,
            data.graphData.pvrReceived || 0,
            data.graphData.pvaReceived || 0,
            data.graphData.messagingContactsMade || 0,
            data.graphData.interviewInviteSent || 0,
            data.graphData.hiredCandidates || 0,
        ]
    }
    return { keys, values }
}


exports.postJob = postJob
exports.editJob = editJob
exports.closeJob = closeJob
exports.removeJob = removeJob
exports.manageJob = manageJob
exports.searchByJobPosition = searchByJobPosition
exports.allJobs = allJobs
exports.jobProfile = jobProfile
exports.jobFilters = jobFilters
exports.popularSearch = popularSearch
exports.jobFormat = jobFormat
exports.fetchPostedJobs = fetchPostedJobs
exports.postDraftJob = postDraftJob
exports.fetchAllCandidates = fetchAllCandidates
exports.fetchUserProfile = fetchUserProfile
exports.fetchShortlistedCandidates = fetchShortlistedCandidates
exports.fetchInterviewingCandidates = fetchInterviewingCandidates
exports.fetchHiredCandidates = fetchHiredCandidates
exports.fetchEmployeeReview = fetchEmployeeReview
exports.fetchInterviewingCalendar = fetchInterviewingCalendar
exports.fetchDashboardGraph = fetchDashboardGraph
exports.searchByJobType = searchByJobType