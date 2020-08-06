import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

import CreateUserService from '@modules/users/services/CreateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let fakeCacheProvider: FakeCacheProvider

let createUser: CreateUserService

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeCacheProvider = new FakeCacheProvider()

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    )
  })

  it('should be able to create a new user', async () => {
    const name = 'New user'
    const email = 'valid@mail.com'
    const password = 'valid-password'

    const user = await createUser.execute({ name, email, password })

    expect(user).toHaveProperty('id')
    expect(user.name).toBe(name)
    expect(user.email).toBe(email)
  })

  it('should not be able to create two users with the same e-mail', async () => {
    const sameEmail = 'same@email.com'

    await createUser.execute({
      name: 'New user',
      email: sameEmail,
      password: 'valid-password',
    })

    await expect(
      createUser.execute({
        name: 'Other user',
        email: sameEmail,
        password: 'other-password',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
