import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'

import CreateUserService from '@modules/users/services/CreateUserService'

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    const { name, email, password } = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    }

    const user = await createUser.execute({ name, email, password })

    expect(user).toHaveProperty('id')
    expect(user.name).toBe(name)
    expect(user.email).toBe(email)
  })

  it('should not be able to create two users with the same e-mail', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    await createUser.execute({
      name: 'John Doe 1',
      email: 'john@doe.com',
      password: '123456-1',
    })

    const promise = createUser.execute({
      name: 'John Doe 2',
      email: 'john@doe.com',
      password: '123456-2',
    })

    expect(promise).rejects.toBeInstanceOf(AppError)
  })
})
