import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'

import ResetPasswordService from '@modules/users/services/ResetPasswordService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeHashProvider: FakeHashProvider

let resetPasswordService: ResetPasswordService

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()
    fakeHashProvider = new FakeHashProvider()

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    )
  })

  it('should be able to reset the user password', async () => {
    const { id } = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      username: 'john',
      password: 'old-123456',
    })

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    const { token } = await fakeUserTokensRepository.generate(id)

    const newPassword = 'new-123456'
    await resetPasswordService.execute({ token, password: newPassword })

    expect(generateHash).toHaveBeenCalledWith(newPassword)
  })

  it('should not be able to reset the password with non-existing token', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    const promise = resetPasswordService.execute({
      token: 'non-existing-token',
      password: 'new-123456',
    })

    expect(promise).rejects.toBeInstanceOf(AppError)
    expect(generateHash).toHaveBeenCalledTimes(0)
  })

  it('should not be able to reset the password with non-existing user', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user-id',
    )

    const promise = resetPasswordService.execute({
      token,
      password: 'new-123456',
    })

    expect(promise).rejects.toBeInstanceOf(AppError)
    expect(generateHash).toHaveBeenCalledTimes(0)
  })

  it('should not be able to reset the user password if the token is expired (expires in 2 hours)', async () => {
    const oldPassword = 'old-123456'
    const { id } = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      username: 'john',
      password: oldPassword,
    })

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    const { token } = await fakeUserTokensRepository.generate(id)

    const promise = resetPasswordService.execute({
      token,
      password: 'new-123456',
    })

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const futureDate = new Date()

      return futureDate.setHours(futureDate.getHours() + 3)
    })

    await expect(promise).rejects.toBeInstanceOf(AppError)
    expect(generateHash).toHaveBeenCalledTimes(0)

    const user = await fakeUsersRepository.findById(id)
    expect(user?.password).toBe(oldPassword)
  })
})
