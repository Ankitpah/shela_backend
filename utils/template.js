//Handlebars.compile method will compile the template into a function.
// The generated function takes a context argument, which will be used to render the template.
//File for compiling the template

'use strict'

const handlebars = require('handlebars')
const moment = require('moment')

handlebars.registerHelper('date', (date) => {
    if (!date) {
        return ''
    }
    return moment(date).format('DD-MM-YYYY')
})

handlebars.registerHelper('time', (date) => {
    if (!date) {
        return ''
    }
    return moment(date).format('hh:mm:ss')
})

handlebars.registerHelper('minhrsConversion', (mins) => {
    if (!mins) {
        return ''
    }

    let text
    if (mins >= 60) {
        if (mins === 60) {
            text = `1 hours`
        }

        let rem = mins % 60
        let hrs = (mins - rem) / 60
        text = `${hrs} hours ${rem} minutes`
    } else {
        text = `${mins} minutes`
    }

    return text
})

handlebars.registerHelper('ge', (a, b) => {
    var next = arguments[arguments.length - 1]
    return (a >= b) ? next.fn(this) : next.inverse(this)
})

// greater than
handlebars.registerHelper('gt', (a, b) => {
    var next = arguments[arguments.length - 1]
    return (a > b) ? next.fn(this) : next.inverse(this)
})

// equal
handlebars.registerHelper('eq', (a, b) => {
    var next = arguments[arguments.length - 1]
    return (a === b) ? next.fn(this) : next.inverse(this)
})

// less than
handlebars.registerHelper('lt', (a, b) => {
    var next = arguments[arguments.length - 1]
    return (a < b) ? next.fn(this) : next.inverse(this)
})

// not equal
handlebars.registerHelper('ne', (a, b) => {
    var next = arguments[arguments.length - 1]
    return (a !== b) ? next.fn(this) : next.inverse(this)
})

exports.formatter = (format) => {
    var template = handlebars.compile(format)
    return {
        inject: (data) => {
            return template(data)
        }
    }
}