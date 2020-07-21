import { uuid } from 'uuidv4'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'

import User from '@modules/users/infra/typeorm/entities/User'

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []

  public async findAll(): Promise<User[]> {
    return this.users
  }

  public async findById(id: string): Promise<User | undefined> {
    const userFound = this.users.find(user => user.id === id)
    return userFound
  }

  public async findByLogin(login: string): Promise<User | undefined> {
    const userFound = this.users.find(
      ({ email, username }) => email === login || username === login,
    )

    return userFound
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User()

    Object.assign(user, { id: uuid() }, userData)

    this.users.push(user)

    return user
  }

  public async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(({ id }) => id === user.id)

    this.users[userIndex] = user

    return user
  }
}

export default FakeUsersRepository
