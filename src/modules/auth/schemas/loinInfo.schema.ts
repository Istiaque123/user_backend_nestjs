import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class LoginInfo {


    @Prop({
        required: true,

    })
    userId: string;

    @Prop({
        required: true,
    })
    token: string;

    @Prop({
        required: true,
        type: Date,
    })
    timeStamp: Date;
}

export const LoginInfoSchema = SchemaFactory.createForClass(LoginInfo);