import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookmark } from './entities/bookmark.entity';
import { AbstractRepository } from 'src/common/abstract.repository';


@Injectable()
export class BookmarkRepository extends AbstractRepository<Bookmark> {
    constructor(
        @InjectModel(Bookmark.name) private bookmarkModel: Model<Bookmark>,
    ) {
        super(bookmarkModel);
    }
}
