'use strict'

const communication = require('../../../utils/communication')
const logger = require('@open-age/logger')('processors:user:crete')
const webConfig = require('config').get('webServer')

const process = async (data, context) => {
    const log = logger.start('process')
    console.log('inisdethe asdfasdf',data)
    const user = await db.powerpanels.findById(data.id)
    console.log('user--->>>',user)
    const content = {
        template: 'user-forgotpassword',
        data: {
            name: user.name,
            email: user.email,
            link: `${webConfig.url}/api/users/verifyResetAdminPasswordToken?token=${data.token}`
        }
    }
    context.logger = log
    communication.forward(user, content, ['email', 'push'], false, context)

    log.end()
    return Promise.resolve()
}

exports.process = process