import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Auth, LoginInfo} from "./schemas";
import {Model} from "mongoose";
import {LoginDto, RefTokenDto, RegisterDto, TokenPayloadDto} from "./dto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as process from "node:process";
import {ResponseDto} from "../../common/dto";


@Injectable()
export class AuthService {

    constructor(
        @InjectModel(Auth.name) private readonly authModel: Model<Auth>,
        @InjectModel(LoginInfo.name) private readonly loginInfoModel: Model<LoginInfo>
    ) {
    }

    async register(registerDto: RegisterDto): Promise<ResponseDto> {

        if (registerDto.password !== registerDto.confirm_password) {
            throw new HttpException("Password not Match", HttpStatus.NOT_ACCEPTABLE);
        }

        const existingUser = await this.authModel.findOne({email: registerDto.email});
        if (existingUser) {
            throw new HttpException({
                data: null,
                message: "User already exists",
                error: true,
            }, HttpStatus.CONFLICT);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(registerDto.password, salt);

        const newUser = new this.authModel({
            ...registerDto,
            password: hashedPassword
        });

        const data = await newUser.save();
        return {
            data: data,
            message: "User created successfully",
            error: false
        };

    }

    async login(loginDto: LoginDto): Promise<ResponseDto> {
        const checkUser = await this.authModel.findOne({email: loginDto.email});
        if (!checkUser) {
            throw new HttpException({data: null,message: "User not found", error: true}, HttpStatus.NOT_FOUND);
        }

        const checkPassword: boolean = await bcrypt.compare(loginDto.password, checkUser.password);
        if (!checkPassword) {
            throw new HttpException({data: null,message: "Invalid password", error: true}, HttpStatus.NOT_ACCEPTABLE);
        }

        //     create tokens
        const timeStamp = new Date();
        const tokenPayload = {
            userId: checkUser._id,
            role: checkUser.role,
            timeStamp
        };

        const refreshToken: string = this.generateRefreshToken(tokenPayload);

        const logInfoData = {
            userId: checkUser._id,
            token: refreshToken,
            timeStamp,
        };

        const accessToken: string = this.generateAccessToken(tokenPayload);

        // store login info in db
        const newLoginInfoModel = new this.loginInfoModel(logInfoData);
        await newLoginInfoModel.save();


        return {
            data: {
                accessToken,
                refreshToken
            },
            message: "Login successful",
            error: false
        }
    }

    async refreshTokens(refreshToken: RefTokenDto): Promise<ResponseDto> {

        const findLoginInfo = await this.loginInfoModel.findOne({
            token: refreshToken.refreshToken,
        });
        if (!findLoginInfo) {
            throw new HttpException({data: null,message: "Invalid refresh token", error: true}, HttpStatus.NOT_ACCEPTABLE);
        }

        const decodeToken: TokenPayloadDto = await new Promise<TokenPayloadDto>((resolve, reject) => {
            const secret: string | undefined = process.env.REFRESH_TOKEN_SECRET;
            jwt.verify(refreshToken.refreshToken, secret!, (err, decoded: TokenPayloadDto) => {
                if (err) {
                    reject(err);
                }
                resolve(decoded);
            });
        });
        const timeStamp = new Date();
        const tokenPayload = {
            userId: decodeToken.userId,
            role: decodeToken.role,
            timeStamp
        };

        const accessToken: string = this.generateAccessToken(tokenPayload);

        return {
            data: {
                accessToken,
                refreshToken: refreshToken.refreshToken
            },
            message: "Token refresh successful",
            error: false
        }

    }


    private generateAccessToken(payload: object): string {
        const secret: string | undefined = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
        }
        return jwt.sign(payload, secret, {expiresIn: "30m"});
    }

    private generateRefreshToken(payload: object): string {
        const secret = process.env.REFRESH_TOKEN_SECRET;
        if (!secret) {
            throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables");
        }
        return jwt.sign(payload, secret, {expiresIn: "30m"});
    }
}

