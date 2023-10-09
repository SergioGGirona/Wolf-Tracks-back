import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { UsersRepository } from '../repository/users.repository.js';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/error.js';

const debug = createDebug('WolfTracks: AuthInter');
export class AuthInterceptor {
  authorization(req: Request, res: Response, next: NextFunction) {
    debug('Interceptor authorization called');
    try {
      const token = req.get('Authorization')?.split(' ')[1];
      if (!token) {
        throw new HttpError(
          498,
          'Invalid Token',
          'You have not provided a token'
        );
      }

      req.body.validatedId = Auth.verifyToken(token).id;
      next();
    } catch (error) {
      next(error);
    }
  }

  async usersAuthentication(req: Request, _res: Response, next: NextFunction) {
    const userID = req.body.validatedId;
    debug('Interceptor usersAuthentication called');

    try {
      const usersRepository = new UsersRepository();
      const user = await usersRepository.getById(userID);
      if (!user) {
        const error = new HttpError(403, 'Forbidden', 'Not owner');
        next(error);
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
