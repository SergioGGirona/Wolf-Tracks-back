import { Router as createRouter } from 'express';
import { UserController } from '../controller/user.controller.js';
import { FilesInterceptor } from '../middleware/files.interceptor.js';
import { UsersRepository } from '../repository/users.repository.js';

const repository = new UsersRepository();
const userController = new UserController(repository);
const filesInterceptor = new FilesInterceptor();
export const userRouter = createRouter();

userRouter.get('/', userController.getAll.bind(userController));

userRouter.post(
  '/register',
  filesInterceptor.singleFileStore('avatar').bind(filesInterceptor),
  userController.register.bind(userController),
  (req, res, _Next) => {
    res.json(req.body);
  }
);

userRouter.post('/suscribe', userController.suscribe.bind(userController));
userRouter.patch('/login', userController.login.bind(userController));
