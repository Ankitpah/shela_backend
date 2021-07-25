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
        const email = "info@shelarecruitment.co.uk";
        // const email = "v3.netclues@gmail.com";
        const mailOptions = {
        from: emailConfig.from,
        to: email,
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
            return {"message":`Failed to send email to ${to}`}
        }
        log.info(`email sent successfully to ${email}`)
        return {"message":`email sent successfully to ${email}`}
        log.end()
    })
}

exports.send = send
