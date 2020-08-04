import User from '@modules/users/infra/typeorm/entities/User'

type ICreateUserDTO = Pick<User, 'name' | 'email' | 'password'>

export default ICreateUserDTO
