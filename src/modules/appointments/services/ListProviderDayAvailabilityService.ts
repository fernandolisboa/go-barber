import { injectable, inject } from 'tsyringe'
import { getHours, isAfter } from 'date-fns'

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
    const currentDate = new Date(Date.now())

    const availability = Array.from(
      { length: endHour - startHour + 1 },
      (_, index) => {
        const hour = index + startHour

        const hasAppointment = appointments.find(
          ({ date }) => getHours(date) === hour,
        )

        const appointmentDate = new Date(year, month - 1, day, hour)

        return {
          hour,
          available: !hasAppointment && isAfter(appointmentDate, currentDate),
        }
      },
    )

    return availability
  }
}

export default ListProviderDayAvailabilityService
