import {Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Req, UseGuards,} from '@nestjs/common';
import {UsersService} from "./users.service";
import {Request} from "express";
import {ResponseDto} from "../../common/dto";
import {JwtAuthGuard} from "../../common/guards";
import {Roles} from "../../common/decorator/roles.decorator";
import {UserRole} from "../../common/enums/roles.enum";
import {RoleGuard} from "../../common/guards/role.guard";


@Controller('api/user')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UsersController {
    constructor(@Inject(UsersService) private readonly usersService: UsersService) {
    }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    @Roles(UserRole.USER, UserRole.ADMIN)
    async createUser(@Req() req: Request): Promise<ResponseDto> {
        return await this.usersService.createUser(req.body);
    }

    @Post('update/:id')
    @Roles(UserRole.USER, UserRole.ADMIN)
    @HttpCode(HttpStatus.ACCEPTED)
    async updateUser(@Param('id') id: string ,@Req() req: Request): Promise<ResponseDto> {
        return await this.usersService.updateUser(id, req.body);
    }

    @Get('getAll')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    async getAll(): Promise<ResponseDto>{
        return await this.usersService.getAllUser();
    }

    @Get('getById/:id')
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.ADMIN)
    async getById(@Param('id') id: string): Promise<ResponseDto>{
        return await this.usersService.getUserById(id);
    }

    @Post('getByEmail')
    @HttpCode(HttpStatus.FOUND)
    @Roles(UserRole.ADMIN)
    async getByEmail(@Req() req: Request): Promise<ResponseDto>{
        return await this.usersService.getUserByEmail(req.body);
    }

    @Post('getByPhone')
    @HttpCode(HttpStatus.FOUND)
    @Roles(UserRole.ADMIN)
    async getByPhone(@Req() req: Request): Promise<ResponseDto>{
        return await this.usersService.getUserByPhone(req.body);
    }



}
