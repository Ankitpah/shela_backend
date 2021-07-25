'use strict'

const mapper = require('../mapper')
const service = require('../service')
const path = require('path')


const postJob = async (request, h) => {
    const log = logger.start('job:api:postJob')
    try {
        request.payload.companyId = request.userInfo
        const message = await service.postJob(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const editJob = async (request, h) => {
    const log = logger.start('job:api:editJob')
    try {
        request.payload.companyId = request.userInfo
        const message = await service.editJob(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const closeJob = async (request, h) => {
    const log = logger.start('job:api:closeJob')

    try {
        request.payload.userInfo = request.userInfo
        const message = await service.closeJob(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const removeJob = async (request, h) => {
    const log = logger.start('job:api:removeJob')
    try {
        request.payload.userInfo = request.userInfo
        const message = await service.removeJob(request.payload)
        log.end()
        // if(data){
        //     const message = "Job Remove Successfully"
        // }
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const manageJob = async (request, h) => {
    const log = logger.start('job:api:manageJob')

    try {
        request.payload.userInfo = request.userInfo
        request.payload.userId = request.userInfo._id
        const message = await service.manageJob(request.payload)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const allJobs = async (request, h) => {
    const log = logger.start('job:api:allJobs')

    try {
        request.query.userInfo = request.userInfo
        const message = await service.allJobs(request.query)
        if (message == "no result found") {
            let searchFailureMessage = "No result found"
            return response.success(h, searchFailureMessage)
        } else {
            return response.success(h, message)
        }
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const jobProfile = async (request, h) => {
    const log = logger.start('job:api:jobProfile')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.jobProfile(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const searchByJobPosition = async (request, h) => {
    const log = logger.start('job:api:searchByJobPosition')

    try {
        request.query.userInfo = request.userInfo
        const message = await service.searchByJobPosition(request.query)
        log.end()
        if (message == "no result found") {
            let searchFailureMessage = "No result found"
            return response.searchFailure(h, searchFailureMessage)
        } else {
            return response.success(h, message)
        }
    } catch (err) {
        log.error(err)
        log.end()

        return response.failure(h, err.message)
    }
}

const searchByJobType = async (request, h) => {
    const log = logger.start('job:api:searchByJobPosition');
    try {
        request.query.userId = request.userInfo._id;
        request.query.userInfo = request.userInfo
        const message = await service.searchByJobType(request.query)
        log.end()
        if (message == "no result found") {
            let searchFailureMessage = "No result found"
            return response.searchFailure(h, searchFailureMessage)
        } else {
            return response.success(h, message)
        }
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const jobFilters = async (request, h) => {
    const log = logger.start('job:api:jobFilters')
    
    try {
        request.payload.userInfo = request.userInfo
        const message = await service.jobFilters(request.payload)
        log.end()
        if (message == "no result found") {
            let searchFailureMessage = "Oops! no job found"
            return response.searchFailure(h, searchFailureMessage)
        } else {
            return response.success(h, message)
        }
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const popularSearch = async (request, h) => {
    const log = logger.start('job:api:popularSearch')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.popularSearch(request)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const fetchPostedJobs = async (request, h) => {
    const log = logger.start('job:api:fetchPostedJobs')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.fetchPostedJobs(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const postDraftJob = async (request, h) => {
    const log = logger.start('job:api:postDraftJob')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.postDraftJob(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const fetchAllCandidates = async (request, h) => {
    const log = logger.start('job:api:fetchAllCandidates')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.fetchAllCandidates(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const fetchUserProfile = async (request, h) => {
    const log = logger.start('job:api:fetchUserProfile')

    try {
        request.query.userId = request.userInfo._id
        let id= request.userInfo._id
        const message = await service.fetchUserProfile(id,request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}



const fetchShortlistedCandidates = async (request, h) => {
    const log = logger.start('job:api:fetchShortlistedCandidates')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.fetchShortlistedCandidates(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const fetchEmployeeReview = async (request, h) => {
    const log = logger.start('job:api:fetchEmployeeReview')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.fetchEmployeeReview(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const fetchInterviewingCandidates = async (request, h) => {
    const log = logger.start('job:api:fetchInterviewingCandidates')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.fetchInterviewingCandidates(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}


const fetchHiredCandidates = async (request, h) => {
    const log = logger.start('job:api:fetchHiredCandidates')

    try {
        request.query.userId = request.userInfo._id
        const message = await service.fetchHiredCandidates(request.query)
        log.end()
        return response.success(h, message)
    } catch (err) {
        log.error(err)
        log.end()
        return response.failure(h, err.message)
    }
}

const fetchInterviewingCalendar = async (request, h) => {

    try {

        const message = await service.fetchInterviewingCalendar(request.userInfo)

        return response.success(h, message)
    } catch (err) {

        return response.failure(h, err.message)
    }

}

const fetchDashboardGraph = async (request, h) => {

    try {
        request.query.userId = request.userInfo._id
        const message = await service.fetchDashboardGraph(request.query)

        return response.success(h, message)
    } catch (err) {

        return response.failure(h, err.message)
    }

}


exports.jobFilters = jobFilters
exports.searchByJobPosition = searchByJobPosition
exports.postJob = postJob
exports.closeJob = closeJob
exports.removeJob = removeJob
exports.manageJob = manageJob
exports.allJobs = allJobs
exports.jobProfile = jobProfile
exports.popularSearch = popularSearch
exports.postDraftJob = postDraftJob
exports.fetchPostedJobs = fetchPostedJobs
exports.fetchAllCandidates = fetchAllCandidates
exports.fetchUserProfile = fetchUserProfile
exports.fetchShortlistedCandidates = fetchShortlistedCandidates
exports.fetchInterviewingCandidates = fetchInterviewingCandidates
exports.fetchHiredCandidates = fetchHiredCandidates
exports.fetchEmployeeReview = fetchEmployeeReview
exports.fetchInterviewingCalendar = fetchInterviewingCalendar
exports.fetchDashboardGraph = fetchDashboardGraph
exports.editJob = editJob
exports.searchByJobType = searchByJobType