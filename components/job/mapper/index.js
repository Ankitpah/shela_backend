'use strict'

exports.toModel = (entity) => {
    const model = {
        id: entity.id,
        firstName: entity.firstName ? entity.firstName : entity.firstName,
        lastName: entity.lastName ? entity.lastName : entity.lastName,
        email: entity.email,
        role: entity.role,
        accessToken: entity.token
    }

    return model
}