import * as Joi from 'joi';

export const RegisterJoiDto = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    confirm_password: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string().valid('admin', 'user').optional()
})