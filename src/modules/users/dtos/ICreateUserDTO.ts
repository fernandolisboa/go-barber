import User from '@modules/users/infra/typeorm/entities/User'

type ICreateUserDTO = Pick<User, 'name' | 'username' | 'email' | 'password'>

export default ICreateUserDTO
