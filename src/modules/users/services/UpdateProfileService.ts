import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'

import User from '@modules/users/infra/typeorm/entities/User'

interface IRequest {
  userId: string
  name: string
  email: string
  old_password?: string
  new_password?: string
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    userId,
    name,
    email,
    old_password,
    new_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new AppError('User not found.')
    }

    if (email !== user.email) {
      const emailAlreadyInUse = await this.usersRepository.findByLogin(email)

      if (emailAlreadyInUse) {
        throw new AppError('This email is already in use.')
      }
    }

    if (!!old_password !== !!new_password) {
      throw new AppError(
        'If you are updating your password, it is required to provide the old and the new one.',
      )
    }

    if (old_password && new_password) {
      const oldPasswordIsValid = await this.hashProvider.compareHash(
        old_password,
        user.password,
      )

      if (!oldPasswordIsValid) {
        throw new AppError('Old password does not match.', 401)
      }

      user.password = await this.hashProvider.generateHash(new_password)
    }

    user.name = name
    user.email = email

    await this.usersRepository.save(user)

    return user
  }
}

export default UpdateProfileService
