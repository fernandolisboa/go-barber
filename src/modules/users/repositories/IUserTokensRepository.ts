import UserToken from '@modules/users/infra/typeorm/entities/UserToken'

interface IUserTokensRepository {
  findAll(): Promise<UserToken[]>
  findByUserId(userId: string): Promise<UserToken[]>
  findById(id: string): Promise<UserToken | undefined>
  generate(userId: string): Promise<UserToken | undefined>
}

export default IUserTokensRepository
