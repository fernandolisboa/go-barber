import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeMailProvider: FakeMailProvider

let sendForgotPassowordEmail: SendForgotPasswordEmailService

describe('', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()
    fakeMailProvider = new FakeMailProvider()

    sendForgotPassowordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeMailProvider,
    )
  })

  it('should be able to send an email with the instructions to reset password', async () => {
    const { email } = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      username: 'john',
      password: '123456',
    })

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    await sendForgotPassowordEmail.execute({ email })

    expect(sendMail).toHaveBeenCalledTimes(1)
  })

  it('should not be able to send an email to a non-existing user', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    const promise = sendForgotPassowordEmail.execute({ email: 'john@doe.com' })

    await expect(promise).rejects.toBeInstanceOf(AppError)
    expect(sendMail).toHaveBeenCalledTimes(0)
  })

  it('should generate a forgot password token', async () => {
    const { id, email } = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      username: 'john',
      password: '123456',
    })

    const generate = jest.spyOn(fakeUserTokensRepository, 'generate')

    await sendForgotPassowordEmail.execute({ email })

    expect(generate).toHaveBeenCalledWith(id)
  })
})
