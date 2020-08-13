import { injectable, inject } from 'tsyringe'
import { classToClass } from 'class-transformer'

import User from '@modules/users/infra/typeorm/entities/User'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface IRequest {
  userId: string
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ userId }: IRequest): Promise<User[]> {
    const cacheKey = `providers-list:${userId}`

    let users = await this.cacheProvider.get<User[]>(cacheKey)

    if (users) {
      return users
    }

    users = await this.usersRepository.findAllProviders({
      except_user_id: userId,
    })

    await this.cacheProvider.save(cacheKey, classToClass(users))

    return users
  }
}

export default ListProvidersService
