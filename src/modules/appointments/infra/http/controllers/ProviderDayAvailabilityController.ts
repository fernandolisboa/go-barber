import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService'

class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProvidersDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    )

    const { provider_id } = request.params
    const { day, month, year } = request.body

    const providers = await listProvidersDayAvailability.execute({
      provider_id,
      day,
      month,
      year,
    })

    return response.json(providers)
  }
}

export default ProviderDayAvailabilityController
