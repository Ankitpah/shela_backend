'use strict'

const communication = require('../../../utils/contanc-us')
const logger = require('@open-age/logger')('processors:user:crete')
const webConfig = require('config').get('webServer')

const process = async (data, context) => {
    const log = logger.start('process')
    const user = await db.users.findById(data.id)
    const jobTitle = data.jobTitle;
    const content = {
        template: 'user-registrationappus',
        data: {
            name: data.params.fullName,
            inquiryEmail:data.params.email,
            connectNumber:data.params.contactNumber,
        }
    }
    context.logger = log
    communication.forward(user, content, ['email'], false, context)

    log.end()
    return Promise.resolve()
}

exports.process = process