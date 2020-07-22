// import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository'

import ResetPasswordService from '@modules/users/services/ResetPasswordService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository

let resetPasswordService: ResetPasswordService

describe('', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    )
  })

  it('should be able to reset the user password', async () => {
    const { id } = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      username: 'john',
      password: 'old-123456',
    })

    const { token } = await fakeUserTokensRepository.generate(id)

    const newPassword = 'new-123456'
    await resetPasswordService.execute({ token, password: newPassword })

    const user = await fakeUsersRepository.findById(id)

    expect(user?.password).toBe(newPassword)
  })
})
