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
        
        profileStepCompleted:entity.profileStepCompleted,
        isProfileCompletedStep1: entity.isProfileCompletedStep1,
        isProfileCompletedStep2: entity.isProfileCompletedStep2,
        isProfileCompletedStep3: entity.isProfileCompletedStep3,
        isProfileCompletedStep4: entity.isProfileCompletedStep4,

    }

    return model
}
