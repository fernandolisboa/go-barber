import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService'
import CreateUserService from '@modules/users/services/CreateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider

let createUser: CreateUserService
let authenticateUser: AuthenticateUserService

describe('AuthenticateUser', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider)
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    await createUser.execute({
      name: 'Valid name',
      email: 'valid@mail.com',
      password: 'valid-password',
    })
  })

  it('should be able to authenticate user', async () => {
    const response = await authenticateUser.execute({
      email: 'valid@mail.com',
      password: 'valid-password',
    })

    expect(response).toHaveProperty('token')
    expect(response).toHaveProperty('user')
  })

  it('should not be able to authenticate an user with wrong password', async () => {
    await expect(
      authenticateUser.execute({
        email: 'valid@mail.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate non-existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'invalid@mail.com',
        password: 'valid-password',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
