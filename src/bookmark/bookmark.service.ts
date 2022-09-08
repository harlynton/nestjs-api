import { User } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService){}

  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where:{
        userId
      }
    })
  }


  getBookmarkById(userId: number, bookmarkId: number) {}


  async createBookmark(
    userId: number, 
    dto: CreateBookmarkDto
    ) {
      const bookmark = await this.prisma.bookmark.create({
        data:{
          userId,
          ...dto
        }
      })
      return bookmark
    }


  editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {}


  deleteBookmarkById(userId: number, bookmarkId: number) {}
}
