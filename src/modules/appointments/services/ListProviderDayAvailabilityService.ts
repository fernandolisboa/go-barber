import { injectable, inject } from 'tsyringe'
import { getHours } from 'date-fns'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  day: number
  month: number
  year: number
}

type IResponse = Array<{
  hour: number
  available: boolean
}>

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id: providerId,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayOfProvider(
      {
        providerId,
        day,
        month,
        year,
      },
    )

    const startHour = 8
    const endHour = 17

    const availability = Array.from(
      { length: endHour - startHour + 1 },
      (_, index) => {
        const hour = index + startHour

        const hasAppointment = appointments.find(
          ({ date }) => getHours(date) === hour,
        )

        return {
          hour,
          available: !hasAppointment,
        }
      },
    )

    return availability
  }
}

export default ListProviderDayAvailabilityService
