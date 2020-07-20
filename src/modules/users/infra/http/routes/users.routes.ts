import { Router } from 'express'
import { container } from 'tsyringe'

import multer from 'multer'

import uploadConfig from '@config/upload'

import FindAllUsersService from '@modules/users/services/FindAllUsersService'
import CreateUserService from '@modules/users/services/CreateUserService'
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const usersRouter = Router()

const upload = multer(uploadConfig)

usersRouter.get('/', async (_request, response) => {
    const findAllUsers = container.resolve(FindAllUsersService)
    const users = await findAllUsers.execute()

    users.forEach(user => delete user.password)

    return response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body

    const createUser = container.resolve(CreateUserService)

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
        const updateAvatar = container.resolve(UpdateUserAvatarService)

        const user = await updateAvatar.execute({
            userId: request.user.id,
            avatarFilename: request.file.filename,
        })

        delete user.password

        return response.json(user)
    },
)

export default usersRouter
