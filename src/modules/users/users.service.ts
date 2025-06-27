import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User} from "./Schemas";
import {Model} from "mongoose";
import {CreateUserDto, UpdateUserDto} from "./dto";
import {ResponseDto} from "../../common/dto";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    }

    async createUser(createUserDto: CreateUserDto): Promise<ResponseDto> {
        let existingUser = await this.userModel.findOne({email: createUserDto.email});
        if (existingUser) {
            throw new HttpException({
                data: null,
                message: "Email already exists",
                error: true,
            }, HttpStatus.NOT_ACCEPTABLE);
        }
        existingUser = await this.userModel.findOne({phone: createUserDto.phone});
        if (existingUser) {
            throw new HttpException({
                data: null,
                message: "Phone number already exists",
                error: true,
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        try {
            //     create now user
            const newUser = new this.userModel(createUserDto);
            const data = await newUser.save();
            return {
                data: data,
                message: "User created successfully",
                error: false
            };
        }catch (error) {
            return{
                data: null,
                message: `User creation failed ${error}`,
                error: true
            };
        }
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<ResponseDto>  {
        const checkUser = await this.userModel.findById(userId);
        if (!checkUser) {
            throw new HttpException({data: null, message: "User not found", error: true}, HttpStatus.NOT_FOUND);
        }
       try {

           const updateUserData = await this.userModel.findByIdAndUpdate(userId, updateUserDto, {new: true});

           return{
               data: updateUserData,
               message: "User updated successfully",
               error: false
           };
           
       }catch (error) {
           return{
               data: null,
               message: `update failed ${error}`,
               error: true
           };

       }
    }

    async getAllUser(): Promise<ResponseDto> {
        try {
            const data = await this.userModel.find();
            return {
                data: data,
                message: "User fetched successfully",
                error: false
            };
        }catch (error) {
            return {
                data: null,
                message: `User fetch failed ${error}`,
                error: true
            }
        }

    }

    async getUserById(id: string): Promise<ResponseDto> {
        try {
            const data = await this.userModel.findById(id);
            return {
                data: data,
                message: "User fetched successfully",
                error: false
            };
        }catch (error) {
            return {
                data: null,
                message: `User fetch failed ${error}`,
                error: true
            }
        }

    }

    async getUserByEmail(email: string): Promise<ResponseDto> {
        try {
            const data = await this.userModel.findOne({email: email});
            return {
                data: data,
                message: "User fetched successfully",
                error: false
            };
        }catch (error) {
            return {
                data: null,
                message: `User fetch failed ${error}`,
                error: true
            }
        }

    }

    async getUserByPhone(phone: string): Promise<ResponseDto> {
        try {
            const data = await this.userModel.findOne({phone: phone});
            return {
                data: data,
                message: "User fetched successfully",
                error: false
            };
        }catch (error) {
            return {
                data: null,
                message: `User fetch failed ${error}`,
                error: true
            }
        }

    }
}
