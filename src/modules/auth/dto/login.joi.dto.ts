import * as Joi from "joi";

export const LoginJoiDto = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
})