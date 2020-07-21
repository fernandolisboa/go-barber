import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'

import CreateUserService from '@modules/users/services/CreateUserService'
import FindAllUsersService from '@modules/users/services/FindAllUsersService'

describe('FindAllUsers', () => {
  it('should be able get all users', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    await createUser.execute({
      name: 'John Doe 1',
      email: 'john1@doe.com',
      password: '123456',
    })

    await createUser.execute({
      name: 'John Doe 2',
      email: 'john2@doe.com',
      password: '123456',
    })

    await createUser.execute({
      name: 'John Doe 3',
      email: 'john3@doe.com',
      password: '123456',
    })

    const findAllUsers = new FindAllUsersService(fakeUsersRepository)

    const users = await findAllUsers.execute()

    expect(users).toHaveLength(3)
  })
})
