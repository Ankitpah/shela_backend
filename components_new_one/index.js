'use strict'

const fs = require('fs')

const models = async (logger) => {
    const log = logger.start('components:models')
    const components = fs.readdirSync(__dirname)

    try {
        for (const component of components) {
            if (component !== 'index.js' && fs.existsSync(`${__dirname}/${component}/model`)) {
                mongoose.model(component, require(`./${component}/model`))
            }

            if (component !== 'index.js' && fs.existsSync(`${__dirname}/${component}/model/chatRooms.js`)) {
                mongoose.model("chatRooms", require(`./${component}/model/chatRooms.js`))
            }
            if (component !== 'index.js' && fs.existsSync(`${__dirname}/${component}/model/plans.js`)) {
                mongoose.model("plans", require(`./${component}/model/plans.js`))
            }

            if (component !== 'index.js' && fs.existsSync(`${__dirname}/${component}/model/invoice.js`)) {
                mongoose.model("invoice", require(`./${component}/model/invoice.js`))
            }

            if (component !== 'index.js' && fs.existsSync(`${__dirname}/${component}/model/cardDetails.js`)) {
                mongoose.model("cardDetails", require(`./${component}/model/cardDetails.js`))
            }
            if (component !== 'index.js' && fs.existsSync(`${__dirname}/${component}/model/plans.js`)) {
                mongoose.model("plans", require(`./${component}/model/plans.js`))
            }

            if (component !== 'index.js' && fs.existsSync(`${__dirname}/${component}/model/contactus.js`)) {
                mongoose.model("contactus", require(`./${component}/model/contactus.js`))
            }

            if (component !== 'index.js' && fs.existsSync(`${__dirname}/${component}/model/registrationappus.js`)) {
                mongoose.model("registrationappus", require(`./${component}/model/registrationappus.js`))
            }

            if (component !== 'index.js' && fs.existsSync(`${__dirname}/${component}/model/registrationkey.js`)) {
                mongoose.model("registrationkey", require(`./${component}/model/registrationkey.js`))
            }

            if (component !== 'index.js' && fs.existsSync(`${__dirname}/${component}/model/employerAccess.js`)) {
                mongoose.model("employerAccess", require(`./${component}/model/employerAccess.js`))
            }


        }
        log.end()
    } catch (err) {
        log.error(err)
        log.error('error while configuring models')
        log.end()
    }
}

const routes = async (server, logger) => {
    const log = logger.start('components:routes')
    const components = fs.readdirSync(__dirname)
    try {
        for (const component of components) {
            if (component !== 'index.js' && fs.existsSync(`${__dirname}/${component}/route`)) {
                server.route(require(`./${component}/route`))
            }
        }
        log.end()
    } catch (err) {
        log.error(err)
        log.error('error while configuring routes')
        log.end()
    }
}
exports.models = models
exports.routes = routes