import {Schema, Prop, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class User {

    @Prop({
        required: true,
    })
    first_name: string;

    @Prop()
    last_name?: string;

    @Prop({
        required: true,
        unique: true,
    })
    email: string;

    @Prop({
        required: true,
    })
    gender: string;

    @Prop({
        required: true,
        unique: true,
    })
    phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);