import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable, Post } from "@nestjs/common";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService{
    constructor(
        private prisma: PrismaService, 
        private jwt: JwtService,
        private config: ConfigService
    ){}

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

    async signin(dto: AuthDto){
        //1. Find the user by email. If user does not exist, throw exception.
        const user = 
            await this.prisma.user.findUnique({
                where:{
                    email:dto.email
                }
            });
            if (!user) throw new ForbiddenException('Credentials are incorrect!');

        //2. Compare provided password vs. stored password. If provided password is incorrect, throw exception.
        const pwdMatches =await argon.verify(user.hash, dto.password)
        if(!pwdMatches) throw new ForbiddenException('Credentials are incorrect!')
        
        //3. Send back the user.
        return this.signToken(user.id, user.email)
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        };
        const secret = this.config.get('JWT_SECRET')

        const token = await this.jwt.signAsync(
            payload,
            {
                expiresIn: '15m',
                secret: secret,
            },
        );


        return {
            access_token: token,
        }
    }
}
