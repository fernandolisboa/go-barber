import { getRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import User from '../models/User'

type Request = Pick<User, 'name' | 'email' | 'password'>

class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<User> {
        const usersRepository = getRepository(User)

        const existsUser = await usersRepository.findOne({
            where: { email },
        })

        if (existsUser) {
            throw new Error('This email is already in use.')
        }

        const hashedPassword = await hash(password, 8)

        const username = email.substring(0, email.indexOf('@'))

        const user = usersRepository.create({
            name,
            username,
            email,
            password: hashedPassword,
        })

        await usersRepository.save(user)

        return user
    }
}

export default CreateUserService
