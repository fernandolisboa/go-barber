import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO'

interface IMailContato {
  name: string
  email: string
}

interface ISendMailDTO {
  from?: IMailContato
  to: IMailContato
  subject: string
  templateData: IParseMailTemplateDTO
}

export default ISendMailDTO
