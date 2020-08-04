import AppError from '@shared/errors/AppError'

import User from '@modules/users/infra/typeorm/entities/User'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository

let fakeMailProvider: FakeMailProvider

let sendForgotPasswordEmail: SendForgotPasswordEmailService

let validUser: User

describe('SendForgotPasswordEmail', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()

    fakeMailProvider = new FakeMailProvider()

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeMailProvider,
    )

    validUser = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })
  })

  it('should be able to send an email with the instructions to reset password', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    await sendForgotPasswordEmail.execute({ email: validUser.email })

    expect(sendMail).toHaveBeenCalledTimes(1)
  })

  it('should not be able to send an email to a non-existing user', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    await expect(
      sendForgotPasswordEmail.execute({ email: 'invalid@email.com' }),
    ).rejects.toBeInstanceOf(AppError)

    expect(sendMail).toHaveBeenCalledTimes(0)
  })

  it('should generate a forgot password token', async () => {
    const generate = jest.spyOn(fakeUserTokensRepository, 'generate')

    await sendForgotPasswordEmail.execute({ email: validUser.email })

    expect(generate).toHaveBeenCalledWith(validUser.id)
  })
})
