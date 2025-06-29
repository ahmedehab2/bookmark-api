import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { collections } from 'src/common/collection-names';

@Schema({
    timestamps: true,
    collection: collections.BOOKMARKS
})
export class Bookmark extends Document {

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    url: string;

    @Prop({ default: '' })
    description?: string;

    // @Prop({ type: [Types.ObjectId], default: [], ref: collections.TAGS })
    // tags?: Types.ObjectId[]  // better for updating tags and reflect to all but also have cons for populate

    @Prop({ type: [String], default: [] })
    tags?: string[]

}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);
