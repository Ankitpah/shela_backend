// File for calling the email templates and passing data to smtp for sending emails
'use strict'

const fs = require('fs')
const path = require('path')
const appRoot = require('app-root-path')
const templateHelper = require('./template')

const notificationInDB = async (to, title, body, context) => {
    const log = context.logger.start('utils:communication:notificationInDB')
    await new db.notifications({
        to: to,
        from: context.user,
        title: title,
        body: body,
        status: 'active'
    }).save()
    log.end()
}

const forward = async (to, content, types, saveInDb, context) => {
    const log = context.logger.start('utils:communication:forward')
    const title = templateHelper
        .formatter(fs.readFileSync(path.join(appRoot.path, `/templates/${content.template}.title.html`), 'utf8'))
        .inject(content.data)
    const subject = templateHelper
        .formatter(fs.readFileSync(path.join(appRoot.path, `/templates/${content.template}.subject.html`), 'utf8'))
        .inject(content.data)

    if (saveInDb && (to && to.id)) {
        await notificationInDB(to, title, subject, context)
    }
    for (let type of types) {
        switch (type) {
            case 'push':
                // require('../providers/firebase').config()
                break
            case 'email':
                const body = templateHelper
                    .formatter(fs.readFileSync(path.join(appRoot.path, `/templates/${content.template}.html`), 'utf8'))
                    .inject(content.data)

                require('../providers/smtp').send(to.email, subject, body, context)
        }
    }
    log.end()
}
exports.forward = forward