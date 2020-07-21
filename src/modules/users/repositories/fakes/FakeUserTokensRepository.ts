import { uuid } from 'uuidv4'

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'

import UserToken from '@modules/users/infra/typeorm/entities/UserToken'

class FakeUserTokensRepository implements IUserTokensRepository {
  private usersTokens: UserToken[] = []

  public async findAll(): Promise<UserToken[]> {
    return this.usersTokens
  }

  public async findByUserId(userId: string): Promise<UserToken[]> {
    return this.usersTokens.filter(({ user_id }) => user_id === userId)
  }

  public async findById(id: string): Promise<UserToken | undefined> {
    const tokenFound = this.usersTokens.find(token => token.id === id)
    return tokenFound
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken()

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
    })

    this.usersTokens.push(userToken)

    return userToken
  }
}

export default FakeUserTokensRepository
