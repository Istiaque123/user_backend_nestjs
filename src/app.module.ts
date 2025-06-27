import { Module } from '@nestjs/common';
import {DatabaseModule} from "./config/database";
import { UsersModule } from './modules/users';
import { AuthModule } from './modules/auth';

@Module({
    imports: [
        DatabaseModule,
        UsersModule,
        AuthModule,
    ],
})
export class AppModule {}

