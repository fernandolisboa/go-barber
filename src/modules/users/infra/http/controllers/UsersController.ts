import { Request, Response } from 'express'
import { container } from 'tsyringe'

import FindAllUsersService from '@modules/users/services/FindAllUsersService'
import CreateUserService from '@modules/users/services/CreateUserService'
import { classToClass } from 'class-transformer'

class UsersController {
  public async index(_request: Request, response: Response): Promise<Response> {
    const findAllUsers = container.resolve(FindAllUsersService)
    const users = await findAllUsers.execute()

    return response.json(classToClass(users))
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body

    const createUser = container.resolve(CreateUserService)

    const user = await createUser.execute({
      name,
      email,
      password,
    })

    return response.json(classToClass(user))
  }
}

export default UsersController
