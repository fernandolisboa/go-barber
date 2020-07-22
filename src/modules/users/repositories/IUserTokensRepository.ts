import UserToken from '@modules/users/infra/typeorm/entities/UserToken'

interface IUserTokensRepository {
  findByToken(token: string): Promise<UserToken | undefined>
  generate(userId: string): Promise<UserToken>
}

export default IUserTokensRepository
