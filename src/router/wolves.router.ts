import { Router as createRouter } from 'express';
import { WolvesController } from '../controller/wolves.controller.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FilesInterceptor } from '../middleware/files.interceptor.js';
import { WolvesRepository } from '../repository/wolves.repository.js';

const repository = new WolvesRepository();
const wolvesController = new WolvesController(repository);
const filesInterceptor = new FilesInterceptor();
export const wolvesRouter = createRouter();
const authInterceptor = new AuthInterceptor();

wolvesRouter.get('/', wolvesController.getAll.bind(wolvesController));
wolvesRouter.get('/:id', wolvesController.getById.bind(wolvesController));
wolvesRouter.post(
  '/addWolf/',
  authInterceptor.authorization.bind(authInterceptor),
  filesInterceptor.singleFileStore('images').bind(filesInterceptor),
  wolvesController.register.bind(wolvesController)
);

wolvesRouter.patch(
  '/update/:id',
  authInterceptor.authorization.bind(authInterceptor),
  authInterceptor.usersAuthentication.bind(authInterceptor),
  wolvesController.update.bind(wolvesController)
);

wolvesRouter.delete(
  '/:id',
  authInterceptor.authorization.bind(authInterceptor),
  authInterceptor.usersAuthentication.bind(authInterceptor),
  wolvesController.delete.bind(wolvesController)
);
