import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, IsUrl, Length, MinLength, ValidateNested } from 'class-validator';

export class CreateBookmarkDto {
    @IsString()
    @Length(1, 30)
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    url: string;

    @IsString()
    @IsOptional()
    @MinLength(10)
    description?: string;

    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    tags?: string[];
}
