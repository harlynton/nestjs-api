import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService){}
  
  async editUser(
    userID: number, 
    dto: EditUserDto,
  ) {
    const user = await this.prisma.user.update({
      where:{
        id:userID,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;

    return user;
  }
}
