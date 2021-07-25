'use strict'

exports.toModel = (entity) => {
    const model = {
        id: entity.id,
        firstName: entity.firstName ? entity.firstName : entity.firstName,
        lastName: entity.lastName ? entity.lastName : entity.lastName,
        email: entity.email,
        userRole: entity.userRole,
        accessToken: entity.token,
        pvrId:entity.document.pvrId,
        //profileStepCompleted:entity.profileStepCompleted,
        //stepSkipped:entity.stepSkipped,
        
        profileStepCompleted:entity.profileStepCompleted
    

    }

    return model
}