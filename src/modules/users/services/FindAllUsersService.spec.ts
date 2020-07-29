import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'

import CreateUserService from '@modules/users/services/CreateUserService'
import FindAllUsersService from '@modules/users/services/FindAllUsersService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider

let createUser: CreateUserService
let findAllUsers: FindAllUsersService

describe('FindAllUsers', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider)
    findAllUsers = new FindAllUsersService(fakeUsersRepository)

    const password = '123456'

    await createUser.execute({
      name: 'New user 1',
      email: 'valid-1@email.com',
      password,
    })

    await createUser.execute({
      name: 'New user 2',
      email: 'valid-2@email.com',
      password,
    })

    await createUser.execute({
      name: 'New user 3',
      email: 'valid-3@email.com',
      password,
    })
  })

  it('should be able get all users', async () => {
    expect(await findAllUsers.execute()).toHaveLength(3)
  })
})
