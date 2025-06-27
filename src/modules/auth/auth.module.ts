import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {Auth, AuthSchema, LoginInfo, LoginInfoSchema} from "./schemas";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Auth.name,
                schema: AuthSchema
            },
            {
                name: LoginInfo.name,
                schema: LoginInfoSchema,
            }
        ]),

    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
