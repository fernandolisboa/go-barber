import { injectable, inject } from 'tsyringe'

import User from '@modules/users/infra/typeorm/entities/User'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'

@injectable()
class FindAllUsersService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute(): Promise<User[]> {
        const users = await this.usersRepository.findAll()
        return users
    }
}

export default FindAllUsersService
