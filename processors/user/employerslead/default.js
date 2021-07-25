'use strict'

const communication = require('../../../utils/contanc-us')
const logger = require('@open-age/logger')('processors:user:crete')
const webConfig = require('config').get('webServer')

const process = async (data, context) => {
    const log = logger.start('process')
    const user = await db.registrationappus.findById(data.params._id)
    console.log('user==>',user)
    const jobTitle = data.jobTitle;
    const content = {
        template: 'employers-lead',
        data: {
            name: user.name,
            inquiryEmail:user.email,
            connectNumber:user.contactNumber,
            reachOutTimeDate:user.reachOutTimeDate,
            role:user.role,
            message: user.message
        }
    }
    context.logger = log
    communication.forward(user, content, ['email'], false, context)

    log.end()
    return Promise.resolve()
}

exports.process = process