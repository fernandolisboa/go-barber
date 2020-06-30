import { Router } from 'express'
import { getRepository } from 'typeorm'
import multer from 'multer'

import uploadConfig from '../config/upload'
import User from '../models/User'
import CreateUserService from '../services/CreateUserService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const usersRouter = Router()

const upload = multer(uploadConfig)

usersRouter.get('/', async (_request, response) => {
    const usersRepository = getRepository(User)
    const users = await usersRepository.find()

    users.forEach(user => delete user.password)

    return response.json(users)
})

usersRouter.post('/', async (request, response) => {
    try {
        const { name, email, password } = request.body

        const createUser = new CreateUserService()

        const user = await createUser.execute({
            name,
            email,
            password,
        })

        delete user.password

        return response.json(user)
    } catch (err) {
        return response.status(400).json({ error: err.message })
    }
})

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        console.log(request.file)

        return response.json({ ok: true })
    },
)

export default usersRouter
