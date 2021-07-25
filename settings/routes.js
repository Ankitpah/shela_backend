//File for reading components
'use strict'

module.exports.configure = async (server, logger) => {
    const log = logger.start('settings:routes:Initialising routes')

    await require('../components').routes(server, log)
    log.end()
}