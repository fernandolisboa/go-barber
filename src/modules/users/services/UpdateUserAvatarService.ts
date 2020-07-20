import { injectable, inject } from 'tsyringe'
import path from 'path'
import fs from 'fs'

import AppError from '@shared/errors/AppError'
import uploadConfig from '@config/upload'

import User from '@modules/users/infra/typeorm/entities/User'
import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
    userId: string
    avatarFilename: string
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(userId)

        if (!user) {
            throw new AppError(
                'Only authenticated users can change own avatar.',
                401,
            )
        }

        if (user.avatar) {
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            )

            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath,
            )

            if (userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath)
            }
        }

        user.avatar = avatarFilename

        await this.usersRepository.save(user)

        return user
    }
}

export default UpdateUserAvatarService
