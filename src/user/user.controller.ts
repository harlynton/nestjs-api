import { JwtGuard } from './../auth/guard/jwt.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
//import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }
}
