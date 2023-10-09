import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user.js';
import { UsersRepository } from '../repository/users.repository.js';
import { Auth } from '../services/auth.js';
import { CloudinaryService } from '../services/media.files.js';
import { UserController } from './user.controller.js';

jest.mock('../services/auth.js');
describe('Given the class UserController', () => {
  describe('When we instantiate it with no errors', () => {
    const mockData = {
      id: '01',
      firsName: 'Luffy',
      userName: 'Luffy',
      password: '1234',
      avatar: 'test',
    } as unknown as User;

    let mockRepo: UsersRepository;
    let userController: UserController;

    beforeEach(() => {
      mockRepo = {
        getAll: jest.fn().mockResolvedValue([mockData]),
        getById: jest.fn().mockResolvedValue(mockData),
        create: jest.fn().mockResolvedValue(mockData),
        login: jest.fn().mockResolvedValue(mockData),
      } as unknown as UsersRepository;

      userController = new UserController(mockRepo);
    });

    const mockResponse = {
      json: jest.fn().mockResolvedValue(mockData),
      status: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    test('Then, it should call getAll from father and return data', async () => {
      const mockRequest = {} as Request;

      await userController.getAll(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith([mockData]);
    });

    test('Then, you should call getById from father', async () => {
      const mockRequest = { params: { id: '01' } } as unknown as Request;

      const mockNext = jest.fn();

      await userController.getById(mockRequest, mockResponse, mockNext);

      expect(mockRepo.getById).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith([mockData]);
    });

    test('Then, you should call login with no errors', async () => {
      const mockRequest = {
        params: { id: '1' },
        body: { userName: 'Luffy', password: '1234' },
      } as unknown as Request;

      Auth.compare = jest.fn().mockResolvedValueOnce(true);
      Auth.signToken = jest.fn().mockResolvedValueOnce('token');

      await userController.login(mockRequest, mockResponse, mockNext);

      expect(mockRepo.login).toHaveBeenCalledWith({
        key: 'userName',
        value: 'Luffy',
      });
    });

    test('Then login should catch error with wrong password', async () => {
      const mockRequest = {
        params: { id: '1' },
        body: { userName: 'Luffy', password: '1234' },
      } as unknown as Request;
      const responseMock = {
        json: jest.fn(),
      } as unknown as Response;
      const nextMocking = jest.fn() as NextFunction;
      Auth.compare = jest.fn().mockResolvedValueOnce(false);

      await userController.login(mockRequest, responseMock, nextMocking);
      expect(nextMocking).toHaveBeenCalled();
    });

    test('Then, you should call register', async () => {
      Auth.encrypt = jest.fn().mockResolvedValueOnce('1234');

      const mockReq = {
        body: mockData,
        file: { filename: 'filename', destination: 'destination' },
      } as unknown as Request;

      const mockRes = {
        status: 201,
        json: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn() as NextFunction;

      CloudinaryService.prototype.uploadPhoto = jest
        .fn()
        .mockResolvedValue(mockReq.body.avatar);

      await userController.register(mockReq, mockRes, mockNext);

      expect(mockRepo.create).toHaveBeenCalledWith(mockData);
      expect(mockRes.status).toEqual(201);
    });
  });

  describe('when we instantiate it with errors', () => {
    let mockRepo: UsersRepository;
    let userController: UserController;
    beforeEach(() => {
      mockRepo = {
        getAll: jest.fn().mockRejectedValueOnce(new Error('GetAll Error')),
        getById: jest.fn().mockRejectedValueOnce(new Error('GetById Error')),
        create: jest.fn().mockRejectedValueOnce(new Error('create Error')),
        login: jest.fn().mockResolvedValueOnce(false),
      } as unknown as UsersRepository;
      userController = new UserController(mockRepo);
    });

    const mockRequest = {
      params: { id: '1' },
      body: { userName: 'Luffy', password: '1234' },
    } as unknown as Request;

    test('then it should call the next error function of getAll', async () => {
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;

      await userController.getAll(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getAll).toHaveBeenCalledWith();
      expect(mockNext).toHaveBeenCalledWith(new Error('GetAll Error'));
    });

    test('then it should call the next error function of getById', async () => {
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      await userController.getById(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test('then it should call the next error function of register', async () => {
      const responseMock = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;

      await userController.register(mockRequest, responseMock, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test('then we should login with errors and catch the error', async () => {
      const responseMock = {
        json: jest.fn(),
      } as unknown as Response;
      const nextMocking = jest.fn() as NextFunction;

      await userController.login(mockRequest, responseMock, nextMocking);
      expect(nextMocking).toHaveBeenCalled();
    });
  });

  describe('when we instantiate it with no login method', () => {
    let mockRepo: UsersRepository;
    let userController: UserController;
    beforeEach(() => {
      mockRepo = {
        getAll: jest.fn().mockRejectedValueOnce(new Error('GetAll Error')),
      } as unknown as UsersRepository;
      userController = new UserController(mockRepo);
    });

    const mockRequest = {
      body: { userName: 'Luffy', password: '1234' },
    } as unknown as Request;

    test('then we should login with error and catch the error', async () => {
      const responseMock = {} as unknown as Response;
      const nextMocking = jest.fn() as NextFunction;

      await userController.login(mockRequest, responseMock, nextMocking);
      expect(nextMocking).toHaveBeenCalled();
    });
  });
});
