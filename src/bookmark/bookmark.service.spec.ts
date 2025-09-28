import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from 'src/bookmark/bookmark.service';
import { BookmarkRepository } from 'src/bookmark/bookmark.repo';
import { NotFoundException } from '@nestjs/common';
import { CreateBookmarkDto } from 'src/bookmark/dto/create-bookmark.dto';
import { UpdateBookmarkDto } from 'src/bookmark/dto/update-bookmark.dto';
import { QueryDto } from 'src/bookmark/dto/query.dto';

describe('BookmarkService', () => {
  let service: BookmarkService;
  let repository: BookmarkRepository;

  const mockBookmarkRepository = {
    create: jest.fn(),
    findAndPaginate: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarkService,
        {
          provide: BookmarkRepository,
          useValue: mockBookmarkRepository,
        },
      ],
    }).compile();

    service = module.get<BookmarkService>(BookmarkService);
    repository = module.get<BookmarkRepository>(BookmarkRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockBookmark = {
    _id: 'mock-id',
    title: 'Test Bookmark',
    url: 'https://test.com',
    description: 'Test Description',
    tags: ['test'],
  };

  describe('create', () => {
    it('should create a new bookmark', async () => {
      const createDto: CreateBookmarkDto = {
        title: 'Test Bookmark',
        url: 'https://test.com',
        description: 'Test Description',
        tags: ['test'],
      };

      mockBookmarkRepository.create.mockResolvedValue(mockBookmark);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockBookmark);
    });
  });

  describe('findAll', () => {
    it('should return paginated bookmarks without search', async () => {
      const queryDto: QueryDto = {
        page: 1,
        limit: 10,
      };

      const mockResponse = {
        items: [mockBookmark],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      mockBookmarkRepository.findAndPaginate.mockResolvedValue(mockResponse);

      const result = await service.findAll(queryDto);

      expect(repository.findAndPaginate).toHaveBeenCalledWith(
        {},
        { limit: 10, page: 1 },
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return filtered bookmarks with search', async () => {
      const queryDto: QueryDto = {
        page: 1,
        limit: 10,
        search: 'test',
      };

      const mockResponse = {
        items: [mockBookmark],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      mockBookmarkRepository.findAndPaginate.mockResolvedValue(mockResponse);

      const result = await service.findAll(queryDto);

      expect(repository.findAndPaginate).toHaveBeenCalledWith(
        {
          $or: [
            { title: { $regex: 'test', $options: 'i' } },
            { description: { $regex: 'test', $options: 'i' } },
          ],
        },
        { limit: 10, page: 1 },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should return a bookmark by id', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(mockBookmark);

      const result = await service.findOne('mock-id');

      expect(repository.findById).toHaveBeenCalledWith('mock-id');
      expect(result).toEqual(mockBookmark);
    });

    it('should throw NotFoundException when bookmark not found', async () => {
      mockBookmarkRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a bookmark', async () => {
      const updateDto: UpdateBookmarkDto = {
        title: 'Updated Title',
      };

      const updatedBookmark = { ...mockBookmark, ...updateDto };
      mockBookmarkRepository.findByIdAndUpdate.mockResolvedValue(
        updatedBookmark,
      );

      const result = await service.update('mock-id', updateDto);

      expect(repository.findByIdAndUpdate).toHaveBeenCalledWith(
        'mock-id',
        updateDto,
        { new: true },
      );
      expect(result).toEqual(updatedBookmark);
    });

    it('should throw NotFoundException when bookmark not found for update', async () => {
      const updateDto: UpdateBookmarkDto = {
        title: 'Updated Title',
      };

      mockBookmarkRepository.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a bookmark', async () => {
      mockBookmarkRepository.findByIdAndDelete.mockResolvedValue(mockBookmark);

      const result = await service.remove('mock-id');

      expect(repository.findByIdAndDelete).toHaveBeenCalledWith('mock-id');
      expect(result).toEqual(mockBookmark);
    });

    it('should throw NotFoundException when bookmark not found for deletion', async () => {
      mockBookmarkRepository.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
