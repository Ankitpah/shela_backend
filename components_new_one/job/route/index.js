/**
author : Simran
created_on : 12 Nov 2018
**/
'use strict'
const api = require('../api')
const specs = require('../specs')

module.exports = [{
        method: 'POST',
        path: '/api/job/postJob',
        options: specs.postJob,
        handler: api.postJob
    }, {
        method: 'POST',
        path: '/api/job/closeJob',
        options: specs.closeJob,
        handler: api.closeJob
    },
    {
        method: 'POST',
        path: '/api/job/removeJob',
        options: specs.removeJob,
        handler: api.removeJob
    },
     {
        method: 'POST',
        path: '/api/job/manageJob',
        options: specs.manageJob,
        handler: api.manageJob
    }, {
        method: 'GET',
        path: '/api/job/jobProfile',
        options: specs.jobProfile,
        handler: api.jobProfile
    }, {
        method: 'GET',
        path: '/api/job/allJobs',
        options: specs.allJobs,
        handler: api.allJobs
    },
    {
        method: 'GET',
        path: '/api/job/searchByJobPosition',
        options: specs.searchByJobPosition,
        handler: api.searchByJobPosition
    },
    {
        method: 'GET',
        path: '/api/job/searchByJobType',
        options: specs.searchByJobType,
        handler: api.searchByJobType
    },
    {
        method: 'POST',
        path: '/api/job/jobFilters',
        options: specs.jobFilters,
        handler: api.jobFilters
    },
    {
        method: 'GET',
        path: '/api/job/popularSearch',
        options: specs.popularSearch,
        handler: api.popularSearch
    },
    {
        method: 'GET',
        path: '/api/employer/fetchPostedJobs',
        options: specs.fetchPostedJobs,
        handler: api.fetchPostedJobs
    },
    {
        method: 'GET',
        path: '/api/employer/postDraftJob',
        options: specs.postDraftJob,
        handler: api.postDraftJob
    },
    {
        method: 'GET',
        path: '/api/employer/fetchAllCandidates',
        options: specs.fetchAllCandidates,
        handler: api.fetchAllCandidates
    },
    {
        method: 'GET',
        path: '/api/employer/fetchUserProfile',
        options: specs.fetchUserProfile,
        handler: api.fetchUserProfile
    },
    {
        method: 'GET',
        path: '/api/employer/fetchShortlistedCandidates',
        options: specs.fetchShortlistedCandidates,
        handler: api.fetchShortlistedCandidates
    },
    {
        method: 'GET',
        path: '/api/employer/fetchInterviewingCandidates',
        options: specs.fetchInterviewingCandidates,
        handler: api.fetchInterviewingCandidates
    },
    {
        method: 'GET',
        path: '/api/employer/fetchHiredCandidates',
        options: specs.fetchHiredCandidates,
        handler: api.fetchHiredCandidates
    },
    {
        method: 'GET',
        path: '/api/employer/fetchEmployeeReview',
        options: specs.fetchEmployeeReview,
        handler: api.fetchEmployeeReview
    },
    {
        method: 'GET',
        path: '/api/employer/fetchInterviewingCalendar',
        options: specs.fetchInterviewingCalendar,
        handler: api.fetchInterviewingCalendar
    }, {
        method: 'GET',
        path: '/api/employer/fetchDashboardGraph',
        options: specs.fetchDashboardGraph,
        handler: api.fetchDashboardGraph
    },{
        method: 'PUT',
        path: '/api/job/editJob',
        options: specs.editJob,
        handler: api.editJob
    }


]