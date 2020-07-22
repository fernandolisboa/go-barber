import { injectable, inject } from 'tsyringe'
import AppError from '@shared/errors/AppError'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'

interface IRequest {
  email: string
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByLogin(email)

    if (!user) {
      throw new AppError('There is no user with this email')
    }

    await this.userTokensRepository.generate(user.id)

    await this.mailProvider.sendMail(
      email,
      'Pedido de recuperação de senha recebido.',
    )
  }
}

export default SendForgotPasswordEmailService
