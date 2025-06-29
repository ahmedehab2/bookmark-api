import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { QueryDto } from './dto/query.dto';


@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) { }

  @Post()
  async create(@Body() createBookmarkDto: CreateBookmarkDto) {
    return await this.bookmarkService.create(createBookmarkDto);
  }

  @Get()
  async findAll(
    @Query() queryDto: QueryDto,

  ) {
    console.log(queryDto,
      typeof queryDto.limit,
      typeof queryDto.page,
      typeof queryDto.search,

    )
    return await this.bookmarkService.findAll(queryDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.bookmarkService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return await this.bookmarkService.update(id, updateBookmarkDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const RES = await this.bookmarkService.remove(id);
    return {
      message: `Bookmark with id ${id} has been removed`,
    };
  }
}
