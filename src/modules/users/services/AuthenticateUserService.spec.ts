import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService'
import CreateUserService from '@modules/users/services/CreateUserService'

describe('AuthenticateUser', () => {
  it('should be able to authenticate user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    const response = await authenticateUser.execute({
      login: 'john@doe.com',
      password: '123456',
    })

    expect(response).toHaveProperty('token')
    expect(response).toHaveProperty('user')
  })

  it('should not be able to authenticate an user with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    const promise = authenticateUser.execute({
      login: 'john@doe.com',
      password: 'wrong-password',
    })

    expect(promise).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate non-existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    const promise = authenticateUser.execute({
      login: 'john@doe.com',
      password: '123456',
    })

    expect(promise).rejects.toBeInstanceOf(AppError)
  })
})
