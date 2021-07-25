'use strict'

const communication = require('../../../utils/communication')
const logger = require('@open-age/logger')('processors:user:crete')
const webConfig = require('config').get('webServer')

const process = async (data, context) => {
    const log = logger.start('process')
    const user = await db.users.findById(data.id)
    const jobTitle = data.jobTitle;
    const message = data.message;
    const content = {
        template: 'user-interviewSchedule',
        data: {
            name: user.fullName,
            email: user.email,
            jobTitle: jobTitle,
            message:message
        }
    }
    context.logger = log
    communication.forward(user, content, ['email'], false, context)

    log.end()
    return Promise.resolve()
}

exports.process = process