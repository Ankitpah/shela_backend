'use strict'

const communication = require('../../../utils/communication')
const logger = require('@open-age/logger')('processors:user:crete')
const webConfig = require('config').get('webServer')

const process = async (data, context) => {
    const log = logger.start('process')
    const user = await db.users.findById(data.id)
    const jobTitle = data.jobTitle;
    const content = {
        template: 'user-sendJobInvite',
        obj: {
            name: user.fullName,
            email: user.email,
            jobTitle: jobTitle
        }
    }
    context.logger = log
    communication.forward(user, content, ['email'], false, context)

    log.end()
    return Promise.resolve()
}

exports.process = process