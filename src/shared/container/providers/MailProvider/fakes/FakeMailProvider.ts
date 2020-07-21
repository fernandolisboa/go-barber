import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'

interface IMail {
  to: string
  body: string
}

class FakeMailProvider implements IMailProvider {
  private outbox: IMail[] = []

  public async sendMail(to: string, body: string): Promise<void> {
    this.outbox.push({ to, body })
  }
}

export default FakeMailProvider
