interface IMailConfig {
  driver: 'ethereal' | 'ses'
  defaults: {
    from: {
      name: string
      email: string
    }
  }
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      name: 'Fernando I. Lisboa',
      email: 'fernando@anarkodev.com.br',
    },
  },
} as IMailConfig
