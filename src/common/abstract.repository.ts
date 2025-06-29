import mongoose, {
  FilterQuery,
  Model,
  PopulateOptions,
  QueryOptions,
  UpdateQuery,
  ProjectionType,
  Document,

} from 'mongoose';

export interface FindAndPaginateOptions<T> {
  page?: number;
  limit?: number;
  projection?: ProjectionType<T>;
  populate?: PopulateOptions | PopulateOptions[];
  sort?: string | { [key: string]: mongoose.SortOrder };
  queryOptions?: QueryOptions<T>;
}

export abstract class AbstractRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) { }

  async create(document: Partial<T>): Promise<T> {
    return (await this.model.create(document)).toObject()
  }

  async findOne(
    filterQuery: FilterQuery<T>,
    projection?: ProjectionType<T>,
    populate?: PopulateOptions | PopulateOptions[],
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    let query = this.model.findOne(filterQuery, projection, options);
    if (populate) query = query.populate(populate);
    return query.lean<T>().exec();
  }

  async findById(
    id: string,
    projection?: ProjectionType<T>,
    populate?: PopulateOptions | PopulateOptions[],
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    let query = this.model.findById(id, projection, options);
    if (populate) query = query.populate(populate);
    return query.lean<T>().exec();
  }

  async findAll(
    filterQuery: FilterQuery<T> = {},
    projection?: ProjectionType<T>,
    populate?: PopulateOptions | PopulateOptions[],
    queryOptions?: QueryOptions<T>,
  ): Promise<T[]> {
    let query = this.model.find(filterQuery, projection, queryOptions);
    if (populate) query = query.populate(populate);
    return query.lean<T[]>().exec();
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filterQuery, updateQuery, { ...options })
      .lean<T>()
      .exec();
  }

  async findByIdAndUpdate(
    id: string,
    updateQuery: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, updateQuery, { ...options })
      .lean<T>()
      .exec();
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model.findOneAndDelete(filterQuery, options).lean<T>().exec();
  }

  async findByIdAndDelete(
    id: string,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model.findByIdAndDelete(id, options).lean<T>().exec();
  }

  async count(filterQuery: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filterQuery).exec();
  }

  async deleteMany(filterQuery: FilterQuery<T>) {
    return this.model.deleteMany(filterQuery).exec();
  }

  async findAndPaginate(
    filterQuery: FilterQuery<T> = {},
    options?: FindAndPaginateOptions<T>,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const skip = (page - 1) * limit;

    let query = this.model
      .find(filterQuery, options?.projection, options?.queryOptions)
      .sort(options?.sort)
      .skip(skip)
      .limit(limit);
    if (options?.populate) query = query.populate(options.populate);
    const [data, total] = await Promise.all([
      query.lean<T[]>().exec(),
      this.model.countDocuments(filterQuery).exec(),
    ]);

    return { data, total, page, limit };
  }
}
