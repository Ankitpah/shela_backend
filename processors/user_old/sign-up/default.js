'use strict'

const communication = require('../../../utils/communication')
const logger = require('@open-age/logger')('processors:user:crete')
const webConfig = require('config').get('webServer')

const process = async (data, context) => {
    const log = logger.start('process')

    const user = await db.users.findById(data.id)

    const content = {
        template: 'user-register',
        data: {
            name: user.firstName,
            email: user.email,
            link: `${webConfig.url}/api/users/email/verify?token=${user.emailVerifyToken}`
        }
    }
    context.logger = log
    communication.forward(user, content, ['email'], false, context)

    log.end()
    return Promise.resolve()
}

exports.process = process