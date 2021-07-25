'use strict'

const communication = require('../../../utils/communication')
const logger = require('@open-age/logger')('processors:user:crete')
const webConfig = require('config').get('webServer')

const process = async (data, context) => {
    const log = logger.start('process')
    let reporterId = data.report.reporterName._id
    const user = await db.users.findById(reporterId)
    // user.email = "adminShela123@yopmail.com"
    user.email = "info@shelarecruitment.co.uk"

    const content = {
        template: 'reportIssue',
        data: {
            name: user.fullName,
            email: user.email,
            reportedEmail: data.report.reportedEmail,
            reportedUserName: data.report.fullName,
            message: data.report.message,
            // link: `${webConfig.url}/api/users/email/verify?token=${user.emailVerifyToken}`
        }
    }
    context.logger = log
    communication.forward(user, content, ['email'], false, context)

    log.end()
    return Promise.resolve()
}

exports.process = process