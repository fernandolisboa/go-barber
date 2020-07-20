import { Router } from 'express'
import { getRepository } from 'typeorm'
import multer from 'multer'

import uploadConfig from '@config/upload'

import User from '@modules/users/infra/typeorm/entities/User'

import CreateUserService from '@modules/users/services/CreateUserService'
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const usersRouter = Router()

const upload = multer(uploadConfig)

usersRouter.get('/', async (_request, response) => {
    const usersRepository = getRepository(User)
    const users = await usersRepository.find()

    users.forEach(user => delete user.password)

    return response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body

    const createUser = new CreateUserService()

    const user = await createUser.execute({
        name,
        email,
        password,
    })

    delete user.password

    return response.json(user)
})

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const updateAvatar = new UpdateUserAvatarService()

        const user = await updateAvatar.execute({
            userId: request.user.id,
            avatarFilename: request.file.filename,
        })

        delete user.password

        return response.json(user)
    },
)

export default usersRouter
