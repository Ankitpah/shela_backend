'use strict'

const communication = require('../../../utils/communication')
const logger = require('@open-age/logger')('processors:user:crete')
const webConfig = require('config').get('webServer')

const process = async (data, context) => {
    const log = logger.start('process')

    const user = await db.users.findById(data.id)

    const content = {
        template: 'user-forgot-password',
        data: {
            name: user.firstName,
            email: user.email,
            link: `${webConfig.url}/api/users/verifyResetPasswordToken?token=${user.resetPasswordToken}`
        }
    }
    context.logger = log
    communication.forward(user, content, ['email', 'push'], false, context)

    log.end()
    return Promise.resolve()
}

exports.process = process