import User from '@modules/users/infra/typeorm/entities/User'

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import IListProvidersDTO from '@modules/users/dtos/IListProvidersDTO'

interface IUsersRepository {
  findAll(): Promise<User[]>
  findAllProviders(data: IListProvidersDTO): Promise<User[]>
  findById(id: string): Promise<User | undefined>
  findByLogin(login: string): Promise<User | undefined>
  create(data: ICreateUserDTO): Promise<User>
  save(user: User): Promise<User>
}

export default IUsersRepository
