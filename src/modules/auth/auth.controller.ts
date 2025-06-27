import { Controller, HttpCode, HttpStatus, Inject, Post, Req, UsePipes} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {Request} from "express";
import {ResponseDto} from "../../common/dto";
import {RegisterJoiDto, LoginJoiDto} from "./dto";
import {JoiValidationPipe} from "../../common/pipes";

@Controller('api/auth')
export class AuthController {
    constructor(@Inject(AuthService) private readonly authService: AuthService) {
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new JoiValidationPipe(RegisterJoiDto))
    async register(@Req() req: Request): Promise<ResponseDto| undefined>  {
      return await this.authService.register(req.body);
    }

    @Post('login')
    @HttpCode(HttpStatus.ACCEPTED)
    @UsePipes(new JoiValidationPipe(LoginJoiDto))
    async login(@Req() req: Request): Promise<ResponseDto| undefined>  {
        return await this.authService.login(req.body);
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(@Req() req: Request): Promise<ResponseDto| undefined>  {
        return await this.authService.refreshTokens(req.body);
    }
}
