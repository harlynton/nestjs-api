import { AuthDto } from './dto/auth.dto';
import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable, Post } from "@nestjs/common";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService){}

    @Post('signup')
    async signup(dto: AuthDto){
        //1. Generate the password hash:
        const hash = await argon.hash(dto.password);

        //2. Save the new user in the DB:
        try {
            const user = await this.prisma.user.create({
                data:{
                    email:dto.email,
                    hash,
                }
            });
            delete user.hash

            //3. Return the saved user:
            return user;
            
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        'Credentials already taken'
                    )
                }
            }
            throw error
        }

    }

    signin(){
        return {msg:"I have signed in!"};
    }
}