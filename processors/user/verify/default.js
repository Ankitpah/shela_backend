'use strict'

const logger = require('@open-age/logger')('processors/user/verify')

exports.process = async (data, context) => {
    const log = logger.start('process')

    const user = await db.users.findById(data.id)

    log.end()

    return Promise.resolve(null)
}