import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'

import User from '@modules/users/infra/typeorm/entities/User'

type IRequest = Pick<User, 'name' | 'email' | 'password'>

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const existsUser = await this.usersRepository.findByLogin(email)

    if (existsUser) {
      throw new AppError('This email is already in use.')
    }

    const hashedPassword = await this.hashProvider.generateHash(password)

    const username = email.substring(0, email.indexOf('@'))

    const user = await this.usersRepository.create({
      name,
      username,
      email,
      password: hashedPassword,
    })

    return user
  }
}

export default CreateUserService
