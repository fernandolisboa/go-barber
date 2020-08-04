import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'

import ResetPasswordService from '@modules/users/services/ResetPasswordService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeHashProvider: FakeHashProvider

let resetPasswordService: ResetPasswordService

let validUserId: string
let validToken: string

const oldPassword = 'old-123456'

describe('ResetPassword', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()
    fakeHashProvider = new FakeHashProvider()

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    )

    const { id } = await fakeUsersRepository.create({
      name: 'New user',
      email: 'valid@email.com',
      password: oldPassword,
    })

    validUserId = id

    const { token } = await fakeUserTokensRepository.generate(validUserId)

    validToken = token
  })

  it('should be able to reset the user password', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    const newPassword = 'new-123456'

    await resetPasswordService.execute({
      token: validToken,
      password: newPassword,
    })

    expect(generateHash).toHaveBeenCalledWith(newPassword)
  })

  it('should not be able to reset the password with non-existing token', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: 'valid-password',
      }),
    ).rejects.toBeInstanceOf(AppError)

    expect(generateHash).toHaveBeenCalledTimes(0)
  })

  it('should not be able to reset the password with non-existing user', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user-id',
    )

    expect(
      resetPasswordService.execute({ token, password: 'valid-password' }),
    ).rejects.toBeInstanceOf(AppError)

    expect(generateHash).toHaveBeenCalledTimes(0)
  })

  it('should not be able to reset the user password if the token is expired (expires in 2 hours)', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    const promise = resetPasswordService.execute({
      token: validToken,
      password: 'new-123456',
    })

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const futureDate = new Date()
      return futureDate.setHours(futureDate.getHours() + 3)
    })

    await expect(promise).rejects.toBeInstanceOf(AppError)
    expect(generateHash).toHaveBeenCalledTimes(0)

    const user = await fakeUsersRepository.findById(validUserId)
    expect(user?.password).toBe(oldPassword)
  })
})
