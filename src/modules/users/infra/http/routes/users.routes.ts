import { Router } from 'express'
import multer from 'multer'

import uploadConfig from '@config/upload'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

import UsersController from '@modules/users/infra/http/controllers/UsersController'
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController'

const usersController = new UsersController()
const userAvatarController = new UserAvatarController()

const usersRouter = Router()

usersRouter.get('/', usersController.index)

usersRouter.post('/', usersController.create)

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  multer(uploadConfig).single('avatar'),
  userAvatarController.update,
)

export default usersRouter
