import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from './../auth/guard/jwt.guard';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService,){}
  @Get()
  getBookmarks(@GetUser('id') userId: number) {}


  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(
      userId,
      bookmarkId,
    );
  }

  @Post()
  createBookmark(
    @GetUser('id') userId: number, 
    @Body() dto: CreateBookmarkDto) {
      return this.bookmarkService.createBookmark(
        userId,
        dto
      );
    }

  @Patch(':id')
  editBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto
    ) {
      return this.bookmarkService.editBookmarkById(
        userId,
        bookmarkId,
        dto
      )
    }

  @Delete(':id')
  deleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number
    ) {
      return this.bookmarkService.deleteBookmarkById(
        userId,
        bookmarkId
      )
    }
}
