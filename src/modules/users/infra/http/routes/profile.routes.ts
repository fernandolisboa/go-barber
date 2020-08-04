import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

import ProfileController from '@modules/users/infra/http/controllers/ProfileController'

const profileController = new ProfileController()

const profileRouter = Router()

profileRouter.use(ensureAuthenticated)

profileRouter.get('/', profileController.show)

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string().when('new_password', {
        is: Joi.string().min(1),
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      new_password: Joi.string(),
      password_confirmation: Joi.string().when('new_password', {
        is: Joi.string().min(1),
        then: Joi.required().valid(Joi.ref('new_password')),
        otherwise: Joi.optional(),
      }),
    },
  }),
  profileController.update,
)

export default profileRouter
