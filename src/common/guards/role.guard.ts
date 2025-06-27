import {CanActivate, ExecutionContext, Inject} from "@nestjs/common";
import {Observable} from "rxjs";
import {Reflector} from "@nestjs/core";
import {UserRole} from "../enums/roles.enum";
import {ROLES_KEY} from "../decorator/roles.decorator";

export class RoleGuard implements CanActivate{
    
    constructor(@Inject(Reflector) private readonly reflector: Reflector) {
    }
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // const roles: string[] = this.reflector.get<string[]>('role', context.getHandler());
        const roles: UserRole[] = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        );

        if (!roles) {
            return true;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { user } = context.switchToHttp().getRequest();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return roles.includes(user.role);
    }

}