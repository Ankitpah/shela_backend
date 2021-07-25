'use strict'
const path = require('path')
const appRoot = require('app-root-path')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const emailConfig = require('config').get('email')

const send = (to, subject, message, context) => {
    const log = context.logger.start('providers:smtp:send')
    const mailTransporter = nodemailer.createTransport(smtpTransport({
        service: emailConfig.service,
        auth: {
            user: emailConfig.auth.user,
            pass: emailConfig.auth.password
        }
    }))


    const mailOptions = {
        from: emailConfig.from,
        to: to,
        subject: subject,
        text: message,
        html: message
    }
    if (context && context.attachment) {
        mailOptions.attachments = [{
            path: path.join(appRoot.path, `/assets/${context.user.id}/${context.attachment.document.type}/${context.attachment.document.id}.pdf`)
        }]
    }

    mailTransporter.sendMail(mailOptions, (err, res) => {
        if (err) {
            log.error(err)
            log.info(`Failed to send email to ${to}`)
            log.end()
            return
        }
        log.info(`email sent successfully to ${to}`)
        log.end()
    })
}

exports.send = send
