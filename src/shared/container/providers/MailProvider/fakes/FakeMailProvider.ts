import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO'

class FakeMailProvider implements IMailProvider {
  private outbox: ISendMailDTO[] = []

  public async sendMail(mail: ISendMailDTO): Promise<void> {
    this.outbox.push(mail)
  }
}

export default FakeMailProvider
