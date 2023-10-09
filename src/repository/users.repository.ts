import { User } from '../entities/user.js';
import { HttpError } from '../types/error.js';
import { Repository } from './repository.js';
import { UserModel } from './users.model.js';

export class UsersRepository implements Repository<User> {
  async getAll(): Promise<User[]> {
    const data = await await UserModel.find()
      .populate('wolves', { nickname: 1 })
      .exec();
    return data;
  }

  async getById(id: string): Promise<User> {
    const data = await UserModel.findById(id)
      .populate('wolves', { nickname: 1 })
      .exec();
    if (!data) {
      throw new HttpError(
        404,
        'Not found',
        "User not found. Don't you know your work mates?",
        { cause: 'Trying getByID method' }
      );
    }

    return data;
  }

  async create(newData: Omit<User, 'id'>): Promise<User> {
    const data = await UserModel.create(newData);
    return data;
  }

  async update(id: string, newData: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(id, newData, { new: true })
      .populate('wolves', { nickname: 1 })
      .exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying update method',
      });
    return data;
  }

  async login({ key, value }: { key: string; value: string }): Promise<User> {
    const data = await UserModel.findOne({ [key]: value }).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying login method',
      });
    return data;
  }
}
