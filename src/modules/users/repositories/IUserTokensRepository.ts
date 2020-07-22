import UserToken from '@modules/users/infra/typeorm/entities/UserToken'

interface IUserTokensRepository {
  findByToken(token: string): Promise<UserToken | undefined>
  generate(user_id: string): Promise<UserToken>
}

export default IUserTokensRepository
