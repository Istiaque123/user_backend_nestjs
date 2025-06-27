import {
    Schema,
    Prop, SchemaFactory
} from "@nestjs/mongoose";

@Schema()
export class Auth {

    @Prop({
        required: true,
        unique: true,
    })
    email: string;

    @Prop({
        required: true,
        }
    )
    password: string;

    @Prop({
        default: 'user'
    })
    role: 'admin' | 'user';
}

export const AuthSchema = SchemaFactory.createForClass(Auth);