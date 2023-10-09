import { Wolf } from '../entities/wolf.js';
import { HttpError } from '../types/error.js';
import { Repository } from './repository.js';
import { WolfModel } from './wolves.model.js';

export class WolvesRepository implements Repository<Wolf> {
  async getAll(): Promise<Wolf[]> {
    const data = await WolfModel.find()
      .populate('specialist', { userName: 1 })
      .exec();
    return data;
  }

  async getById(id: string): Promise<Wolf> {
    const data = await WolfModel.findById(id)
      .populate('specialist', { userName: 1 })
      .exec();
    if (!data) {
      throw new HttpError(
        404,
        'Not found',
        'Wolf not found in our territory, you may have misidentified the tracks.',
        { cause: 'Trying getByID method' }
      );
    }

    return data;
  }

  async create(newWolf: Omit<Wolf, 'id'>): Promise<Wolf> {
    const data = await WolfModel.create(newWolf);
    return data;
  }

  async update(id: string, newData: Partial<Wolf>): Promise<Wolf> {
    const data = await WolfModel.findByIdAndUpdate(id, newData, {
      new: true,
    })
      .populate('specialist', { userName: 1 })
      .exec();
    if (!data)
      throw new HttpError(
        404,
        'Not Found',
        'Wolf not found in our territory, you may have misidentified the tracks',
        {
          cause: 'Trying update method',
        }
      );
    return data;
  }

  async delete(id: string): Promise<void> {
    const data = await WolfModel.findByIdAndDelete(id).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'Wolf not found in file system', {
        cause: 'Trying delete method',
      });
  }
}
