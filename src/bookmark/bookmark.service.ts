import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { BookmarkRepository } from './bookmark.repo';
import { FilterQuery } from 'mongoose';
import { Bookmark } from './entities/bookmark.entity';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class BookmarkService {
  constructor(private bookmarkRepository: BookmarkRepository) {}

  async create(createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarkRepository.create(createBookmarkDto);
  }

  async findAll(queryDto: QueryDto) {
    const { limit, page, search } = queryDto;
    const filter: FilterQuery<Bookmark> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    const options = {
      limit,
      page,
    };
    return this.bookmarkRepository.findAndPaginate(filter, options);
  }

  async findOne(id: string): Promise<Bookmark | null> {
    const Bookmark = await this.bookmarkRepository.findById(id);
    if (!Bookmark) {
      throw new NotFoundException(`Bookmark with id ${id} not found`);
    }
    return Bookmark;
  }

  async update(
    id: string,
    updateBookmarkDto: UpdateBookmarkDto,
  ): Promise<Bookmark | null> {
    const Bookmark = await this.bookmarkRepository.findByIdAndUpdate(
      id,
      updateBookmarkDto,
      {
        new: true,
      },
    );
    if (!Bookmark) {
      throw new NotFoundException(`Bookmark with id ${id} not found`);
    }
    return Bookmark;
  }

  async remove(id: string): Promise<Bookmark | null> {
    const Bookmark = await this.bookmarkRepository.findByIdAndDelete(id);
    if (!Bookmark) {
      throw new NotFoundException(`Bookmark with id ${id} not found`);
    }
    return Bookmark;
  }
}
