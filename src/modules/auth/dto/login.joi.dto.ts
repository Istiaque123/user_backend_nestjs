import Joi from "joi";

export const loginJoiDto = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
})