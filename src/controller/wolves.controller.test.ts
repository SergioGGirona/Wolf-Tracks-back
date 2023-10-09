import { NextFunction, Request, Response } from 'express';
import { Wolf } from '../entities/wolf.js';
import { UsersRepository } from '../repository/users.repository.js';
import { WolvesRepository } from '../repository/wolves.repository.js';
import { CloudinaryService } from '../services/media.files.js';
import { HttpError } from '../types/error.js';
import { WolvesController } from './wolves.controller.js';

describe('Given the class WolvesController', () => {
  describe('When we instantiate it with no errors', () => {
    const mockData = {
      codeName: 'Chopper',
      pack: 'Mugiwara',
      id: '01',
      validatedId: '01',
      wolves: [{}],
    } as unknown as Wolf;
    UsersRepository.prototype.getById = jest.fn().mockReturnValue(mockData);
    UsersRepository.prototype.update = jest.fn().mockReturnValue(mockData);

    const mockRepo = {
      getAll: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    } as unknown as WolvesRepository;

    let wolvesController: WolvesController;
    beforeEach(() => {
      wolvesController = new WolvesController(mockRepo);
    });
    const mockRequest = {
      params: { id: '01' },
      body: { validatedId: '01', specialist: 'Luffy' },
    } as unknown as Request;
    const mockNext = jest.fn() as NextFunction;

    test('Then, it should call getAll method from father and return data', async () => {
      (mockRepo.getAll as jest.Mock).mockResolvedValueOnce([mockData]);
      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockData),
      } as unknown as Response;
      await wolvesController.getAll(mockRequest, mockResponse, mockNext);

      expect(mockRepo.getAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith([mockData]);
    });

    test('Then, it should call delete method and return data', async () => {
      (mockRepo.delete as jest.Mock).mockResolvedValueOnce({});

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockResolvedValue(204),
      } as unknown as Response;
      await wolvesController.delete(mockRequest, mockResponse, mockNext);

      expect(mockRepo.delete).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    test('Then, it should call update method and return data', async () => {
      (mockRepo.delete as jest.Mock).mockResolvedValueOnce(mockData);
      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockData),
        status: jest.fn().mockReturnValue(200),
      } as unknown as Response;

      await wolvesController.update(mockRequest, mockResponse, mockNext);

      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    test('Then, you should call register', async () => {
      mockRepo.create = jest.fn().mockResolvedValueOnce(mockData);
      const mockUser = {
        id: '02',
        wolves: [],
      };
      UsersRepository.prototype.getById = jest.fn().mockResolvedValue(mockUser);
      UsersRepository.prototype.update = jest.fn();

      const mockCreateRequest = {
        body: {
          codeName: 'Chopper',
          pack: 'Mugiwara',
          id: '01',
          validatedId: '01',
          images: 'test',
        },
        file: { filename: 'filename', destination: 'destination' },
      } as unknown as Request;
      const responseMock = {
        json: jest.fn(),
        status: 201,
      } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;

      CloudinaryService.prototype.uploadPhoto = jest
        .fn()
        .mockResolvedValue(mockRequest.body.images);

      await wolvesController.register(
        mockCreateRequest,
        responseMock,
        mockNext
      );

      expect(mockRepo.create).toHaveBeenCalled();
      expect(UsersRepository.prototype.update).toHaveBeenCalled();
      expect(responseMock.status).toEqual(201);
    });
  });
  describe('When we instanciate it with errors', () => {
    const error1 = new HttpError(
      417,
      'Expectation failed',
      'Not received a photo'
    );
    const error2 = new HttpError(
      404,
      'Bad request',
      'Not conextion with repository'
    );

    let mockRepo: WolvesRepository;

    let wolvesController: WolvesController;
    beforeEach(() => {
      mockRepo = {
        update: jest.fn().mockRejectedValue(error2),
        create: jest.fn().mockRejectedValueOnce(error1),
      } as unknown as WolvesRepository;
      wolvesController = new WolvesController(mockRepo);
    });
    const mockNext = jest.fn() as NextFunction;

    test('Then, it should call update method and return error', async () => {
      const mockRequest = { file: {} } as Request;
      const mockData = {} as unknown as Wolf;
      const mockResponse = {
        json: jest.fn().mockRejectedValue(mockData),
      } as unknown as Response;

      await wolvesController.update(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('Then, it should call delete method and return error', async () => {
      const requestMock = {} as Request;

      const mockResponse = {} as unknown as Response;

      await wolvesController.register(requestMock, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(error1).toBeInstanceOf(HttpError);
    });

    test('Then, it should call register method and return error', async () => {
      const requestMock = {} as Request;
      const mockResponse = {} as unknown as Response;
      await wolvesController.delete(requestMock, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(error1).toBeInstanceOf(HttpError);
    });
  });
});
