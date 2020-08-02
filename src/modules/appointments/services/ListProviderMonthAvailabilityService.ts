import { injectable, inject } from 'tsyringe'
import { getDaysInMonth, getDate } from 'date-fns'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  month: number
  year: number
}

type IResponse = Array<{
  day: number
  available: boolean
}>

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id: providerId,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthOfProvider(
      {
        providerId,
        month,
        year,
      },
    )

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1))

    const availability = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => {
        const day = index + 1

        const { length: numberOfAppointmentsInDay } = appointments.filter(
          ({ date }) => getDate(date) === day,
        )

        return {
          day,
          available: numberOfAppointmentsInDay < 10,
        }
      },
    )

    return availability
  }
}

export default ListProviderMonthAvailabilityService
