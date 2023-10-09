import { NextFunction, Request, Response } from 'express';
import { User, UserLogin } from '../entities/user.js';
import { UsersRepository } from '../repository/users.repository.js';
import { Auth } from '../services/auth.js';
import { CloudinaryService } from '../services/media.files.js';
import { HttpError } from '../types/error.js';
import { TokenPayload } from '../types/token.js';
import { Controller } from './controller.js';

export class UserController extends Controller<User> {
  cloudinary: CloudinaryService;
  constructor(public repository: UsersRepository) {
    super(repository);
    this.cloudinary = new CloudinaryService();
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { userName, password } = req.body as unknown as UserLogin;
    const error = new HttpError(401, 'Unauthorized', 'Login error, try again');
    try {
      if (!this.repository.login) throw error;
      const data = await this.repository.login({
        key: 'userName',
        value: userName,
      });
      if (!data) throw error;

      const user = data;
      if (!(await Auth.compare(password, user.password))) throw error;

      const payload: TokenPayload = {
        id: user.id,
        userName: user.userName,
        userFirstName: user.firstName,
      };
      const token = Auth.signToken(payload);
      res.json({ user, token });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file)
        throw new HttpError(417, 'Expectation failed', 'Not received a photo');
      req.body.password = await Auth.encrypt(req.body.password);
      const newPath = req.file.destination + '/' + req.file.filename;
      const photoData = await this.cloudinary.uploadPhoto(newPath);
      req.body.avatar = photoData;
      const newUser = await this.repository.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
}
