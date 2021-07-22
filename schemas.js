const Joi = require('joi');

module.exports.jobSchema = Joi.object({
    job: Joi.object({
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

