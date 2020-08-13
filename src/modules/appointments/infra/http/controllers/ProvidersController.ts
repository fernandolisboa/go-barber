import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

import ListProvidersService from '@modules/appointments/services/ListProvidersService'

class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProviders = container.resolve(ListProvidersService)

    const {
      user: { id: userId },
    } = request

    const providers = await listProviders.execute({ userId })

    return response.json(classToClass(providers))
  }
}

export default ProvidersController
