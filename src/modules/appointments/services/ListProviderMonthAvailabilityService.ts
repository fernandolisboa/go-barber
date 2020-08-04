import { injectable, inject } from 'tsyringe'
import { getDaysInMonth, getDate, isAfter, isSameDay } from 'date-fns'

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
    const currentDate = new Date(Date.now())

    const availability = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => {
        const day = index + 1

        const { length: numberOfAppointmentsInDay } = appointments.filter(
          ({ date }) => getDate(date) === day,
        )

        const appointmentDate = new Date(year, month - 1, day)

        return {
          day,
          available:
            numberOfAppointmentsInDay < 10 &&
            (isAfter(appointmentDate, currentDate) ||
              isSameDay(appointmentDate, currentDate)),
        }
      },
    )

    return availability
  }
}

export default ListProviderMonthAvailabilityService
