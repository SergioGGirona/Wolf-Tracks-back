import { NextFunction, Request, Response } from 'express';
import { Wolf } from '../entities/wolf.js';
import { UsersRepository } from '../repository/users.repository.js';
import { WolvesRepository } from '../repository/wolves.repository.js';
import { CloudinaryService } from '../services/media.files.js';
import { HttpError } from '../types/error.js';
import { Controller } from './controller.js';

export class WolvesController extends Controller<Wolf> {
  cloudinary: CloudinaryService;
  constructor(protected repository: WolvesRepository) {
    super(repository);
    this.cloudinary = new CloudinaryService();
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new HttpError(417, 'Expectation failed', 'Not received a photo');
      }

      const { validatedId } = req.body;
      const userRepo = new UsersRepository();
      const user = await userRepo.getById(validatedId);
      req.body.specialist = user.id;

      const newPath = req.file.destination + '/' + req.file.filename;
      const wolfPhotos = await this.cloudinary.uploadPhoto(newPath);
      req.body.images = wolfPhotos;

      const newWolf = await this.repository.create(req.body);
      user.wolves.push(newWolf);
      userRepo.update(user.id, user);

      res.status(201).json(newWolf);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params)
        throw new HttpError(404, 'Bad request', 'Not coincidence with id');
      const updatedWolf = await this.repository.update(req.params.id, req.body);
      res.status(200);
      res.json(updatedWolf);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { validatedId } = req.body;
      const userRepo = new UsersRepository();
      const user = await userRepo.getById(validatedId);
      const newUserWolves = user.wolves.filter((wolf) => wolf.id !== id);
      user.wolves = newUserWolves;
      userRepo.update(user.id, user);
      await this.repository.delete(id);

      res.json({});
      res.status(204);
    } catch (error) {
      next(error);
    }
  }
}
