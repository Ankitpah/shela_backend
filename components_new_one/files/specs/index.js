 "use strict"

 const validator = require('../validator')
 const context = require('../../../utils/context-builder')

 module.exports = {
     uploadFile: {
         description: 'Upload file in temp',
         notes: 'Upload file in temp folder.Type -1 profile pic , 2- companyVideo, 3- employeeCv , 4- employeePvr,5-employeePva,6-employeeCertificates',
         tags: ['api', 'files'],
         plugins: {
             'hapi-swagger': {
                 payloadType: 'form',
                 responses: {
                     200: {
                         description: 'Example of response model in return to success request',
                         schema: validator.success
                     },
                     320: {
                         description: 'Example of response model in return to failure request',
                         schema: validator.failure
                     }
                 }
             }
         },
         pre: [{
             method: context.validateToken,
             assign: 'token'
         }],
         payload: validator.uploadFile.formPayload,
         validate: {
             payload: validator.uploadFile.payload,
             headers: validator.header,
             failAction: response.failAction
         }
     },
     fetchFile: {
         description: 'To get file from server',
         notes: 'send the file name only',
         tags: ['api', 'files'],
         plugins: {
             'hapi-swagger': {
                 payloadType: 'form',
                 responses: {
                     200: {
                         description: 'Example of response model in return to success request',
                         schema: validator.success
                     },
                     320: {
                         description: 'Example of response model in return to failure request',
                         schema: validator.failure
                     }
                 }
             }
         },
         validate: {
             query: validator.fetchFile.query,
             failAction: response.failAction
         }
     },
     deleteFile: {
         description: 'To get a specific file',
         notes: 'send the file id to be removed.',
         tags: ['api', 'files'],
         plugins: {
             'hapi-swagger': {
                 payloadType: 'form',
                 responses: {
                     200: {
                         description: 'Example of response model in return to success request',
                         schema: validator.success
                     },
                     320: {
                         description: 'Example of response model in return to failure request',
                         schema: validator.failure
                     }
                 }
             }
         },
         pre: [{
             method: context.validateToken,
             assign: 'token'
         }],
         validate: {
             headers: validator.header,
             payload: validator.deleteFile.payload,
             failAction: response.failAction
         }
     },
 }