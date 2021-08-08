const Joi = require('joi');

module.exports.jobSchema = Joi.object({
    job: Joi.object({
        location: Joi.string().required(),
        roundNumber: Joi.number().required(),
        ref: Joi.string().required(),
        name: Joi.string().required(),
        address: Joi.string().required(),
        details: Joi.string().required(),
        freq: Joi.string().required(),
        accManager: Joi.string().required(),
        exterior: Joi.number().required(),
        interior: Joi.number().required(),
    }).required()
});

module.exports.operativeSchema = Joi.object({
    operative: Joi.object({
        name: Joi.string().required(),
        number: Joi.number().required(),
    }).required()
});
