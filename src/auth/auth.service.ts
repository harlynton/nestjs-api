import { PrismaService } from './../prisma/prisma.service';
import { Injectable, Post } from "@nestjs/common";


@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService){}

    @Post('signup')
    signup(){
        
        return {msg:"I have signed up!"};
    }

    signin(){
        return {msg:"I have signed in!"};
    }
}