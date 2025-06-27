// src/modules/auth/dto/register.joi.dto.ts
import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({
    allowUnknown: false,
})
export class RegisterJoiDto {
    @JoiSchema(Joi.string().email().required())
    email: string;

    @JoiSchema(Joi.string().required().min(6))
    password: string;

    @JoiSchema(Joi.string().valid(Joi.ref('password')).required())
    confirm_password: string;

    @JoiSchema(Joi.string().valid('admin', 'user').optional())
    role: string;

}