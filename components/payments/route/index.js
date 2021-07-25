/**
author : Simran
created_on : 21 Nov 2018
**/
'use strict'
const api = require('../api')
const specs = require('../specs')

module.exports = [
    {
    method: 'POST',
    path: '/api/stripe/addCard',
    options: specs.addCard,
    handler: api.addCard
    },
    {
    method: 'GET',
    path: '/api/stripe/isPaid',
    options: specs.isPaid,
    handler: api.isPaid
    }
,{
    method: 'POST',
    path: '/api/webhook/webhooks',
    options: specs.webhooks,
    handler: api.webhooks
},
{
    method: 'POST',
    path: '/api/webhook/retreiveWebhook',
    options: specs.retreiveWebhook,
    handler: api.retreiveWebhook
},
{
    method: 'POST',
    path: '/api/webhook/planCreated',
    options: specs.planCreated,
    handler: api.planCreated
}
,
{
    method: 'POST',
    path: '/api/plans/fetchPlans',
    options: specs.fetchPlans,
    handler: api.fetchPlans
}
,
{
    method: 'POST',
    path: '/api/plans/editPlans',
    options: specs.editPlans,
    handler: api.editPlans
}
,
{
    method: 'POST',
    path: '/api/plans/deletePlan',
    options: specs.deletePlan,
    handler: api.deletePlan
}


// , 
// {
//     method: 'POST',
//     path: '/api/stripe/createSubscription',
//     options: specs.createSubscription,
//     handler: api.createSubscription
// }
//{
//     method: 'POST',
//     path: '/api/stripe/addBankAccount',
//     options: specs.addBankAccount,
//     handler: api.addBankAccount
// }, {
//     method: 'POST',
//     path: '/api/stripe/listAllCards',
//     options: specs.listAllCards,
//     handler: api.listAllCards
// }
]