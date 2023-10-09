import { User } from '../entities/user.js';
import { UserModel } from './users.model.js';
import { UsersRepository } from './users.repository.js';

jest.mock('./users.model');

describe('Given the class UsersRepository', () => {
  describe('When we instantiate it without errors', () => {
    let repository: UsersRepository;
    beforeEach(() => {
      repository = new UsersRepository();
    });

    test('Then, method getAll should be called', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce([]);

      UserModel.find = jest.fn().mockReturnValue({
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

      const mockUser = { id: '1', firstName: 'Luffy' };
      UserModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec: mockExec,
        }),
      });

      const result = await repository.getById(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(UserModel.findById).toHaveBeenCalledWith(mockUser.id);
    });

    test('Then method create should return data', async () => {
      const mockUser = {
        id: '1',
        firstName: 'Luffy',
        wolves: [],
      } as unknown as User;
      UserModel.create = jest.fn().mockReturnValue(mockUser);

      const result = await repository.create(mockUser);

      expect(result).toEqual(mockUser);
      expect(UserModel.create).toHaveBeenCalledWith(mockUser);
    });
    test('Then method update should return data', async () => {
      const mockExec = jest
        .fn()
        .mockResolvedValueOnce({ id: '1', firstName: 'Luffy' });
      const mockUser = { id: '1', firstName: 'Luffy' };

      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec: mockExec,
        }),
      });

      const result = await repository.update(mockUser.id, mockUser);

      expect(result).toEqual(mockUser);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    test('Then method login should return data', async () => {
      const mockExec = jest
        .fn()
        .mockResolvedValueOnce({ firstName: 'Luffy', id: '1' });
      const mockUser = { id: '1', firstName: 'Luffy' };

      UserModel.findOne = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });

      const result = await repository.login({
        key: 'firstName',
        value: 'Luffy',
      });

      expect(result).toEqual(mockUser);
      expect(UserModel.find).toHaveBeenCalled();
    });
  });
  describe('When we instantiate it with errors', () => {
    let repository: UsersRepository;
    beforeEach(() => {
      repository = new UsersRepository();
    });
    test('Then getById with no data should return an error', async () => {
      UserModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      });

      expect(repository.getById('')).rejects.toThrow();
    });
    test('Then update with no data should return an error', async () => {
      const mockDataError = {};
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      });

      expect(repository.update('', mockDataError)).rejects.toThrow();
    });
    test('Then delete with no data should return an error', async () => {
      UserModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      expect(repository.login({ key: '01', value: 'test' })).rejects.toThrow();
    });
  });
});
