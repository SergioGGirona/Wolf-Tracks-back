import { Wolf } from '../entities/wolf.js';
import { WolfModel } from './wolves.model.js';
import { WolvesRepository } from './wolves.repository.js';

jest.mock('./wolves.model.js');

describe('Given the class WolvesRepository', () => {
  describe('When we instantiate it without errors', () => {
    let repository: WolvesRepository;
    beforeEach(() => {
      repository = new WolvesRepository();
    });

    test('Then, method getAll should be called', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce([]);

      WolfModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: mockExec,
        }),
      });
      const result = await repository.getAll();
      expect(result).toEqual([]);
      expect(mockExec).toHaveBeenCalled();
    });
    test('Then method getById should return data', async () => {
      const mockExec = jest
        .fn()
        .mockResolvedValueOnce({ firstName: 'Luffy', id: '1' });

      const mockWolf = { id: '1', firstName: 'Luffy' };
      WolfModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec: mockExec,
        }),
      });

      const result = await repository.getById(mockWolf.id);

      expect(result).toEqual(mockWolf);
      expect(WolfModel.findById).toHaveBeenCalledWith(mockWolf.id);
    });

    test('Then method create should return data', async () => {
      const mockWolf = {
        id: '1',
        firstName: 'Luffy',
        enemies: [],
        friends: [],
      } as unknown as Wolf;
      WolfModel.create = jest.fn().mockReturnValue(mockWolf);

      const result = await repository.create(mockWolf);

      expect(result).toEqual(mockWolf);
      expect(WolfModel.create).toHaveBeenCalledWith(mockWolf);
    });
    test('Then method update should return data', async () => {
      const mockExec = jest
        .fn()
        .mockResolvedValueOnce({ id: '1', firstName: 'Luffy' });
      const mockWolf = { id: '1', firstName: 'Luffy' };

      WolfModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec: mockExec,
        }),
      });

      const result = await repository.update(mockWolf.id, mockWolf);

      expect(result).toEqual(mockWolf);
      expect(WolfModel.findByIdAndUpdate).toHaveBeenCalled();
    });
    test('Then method delete should return any data', async () => {
      const mockWolf = { id: '1', firstName: 'Luffy' };
      WolfModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockWolf),
      });

      const result = await repository.delete(mockWolf.id);

      expect(result).toEqual(undefined);
      expect(WolfModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
  describe('When we instantiate it with errors', () => {
    let repository: WolvesRepository;
    beforeEach(() => {
      repository = new WolvesRepository();
    });
    test('Then getById with no data should return an error', async () => {
      WolfModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      });

      expect(repository.getById('')).rejects.toThrow();
    });
    test('Then update with no data should return an error', async () => {
      const mockData = {};
      WolfModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      });

      expect(repository.update('', mockData)).rejects.toThrow();
    });
    test('Then delete with no data should return an error', async () => {
      WolfModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      expect(repository.delete('')).rejects.toThrow();
    });
  });
});
