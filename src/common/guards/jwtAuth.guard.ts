import {
    CanActivate,
    ExecutionContext, Injectable, UnauthorizedException
} from "@nestjs/common";

import * as jwt from 'jsonwebtoken';
import {Observable} from "rxjs";
import * as process from "node:process";
// import {AuthGuard} from "@nestjs/passport";

@Injectable()
// /*
export class JwtAuthGuard implements CanActivate{

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const req = context.switchToHttp().getRequest();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        const authHeader: string | undefined = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException(
                {
                    data: null,
                    error: true,
                    message: 'Authorization token missing or malformed',
                }
            )
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException({
                data: null,
                error: true,
                message: 'Token not provided',
            });
        }

        try {
            const secret = process.env.ACCESS_TOKEN_SECRET;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            req.user = jwt.verify(token, secret!,);
            return true;
        }catch (error) {
            console.log(error);
            throw new UnauthorizedException({
                error: true,
                message: 'Invalid or expired token',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                details: error.message,
            });
        }
    }

}
 // */


/*
export class JwtAuthGuard extends AuthGuard('jwt'){
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }
}

 */
