import { injectable, inject } from 'tsyringe'
import { startOfHour, isBefore, getHours, format } from 'date-fns'

import AppError from '@shared/errors/AppError'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

type Request = Pick<Appointment, 'provider_id' | 'customer_id' | 'date'>

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({
    provider_id,
    customer_id,
    date,
  }: Request): Promise<Appointment> {
    if (customer_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself")
    }

    const appointmentDate = startOfHour(date)

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date")
    }

    const appointmentHour = getHours(appointmentDate)

    if (appointmentHour < 8 || appointmentHour > 17) {
      throw new AppError('You can only create appointments between 8am and 5pm')
    }

    const existsAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    )

    if (existsAppointmentInSameDate) {
      throw new AppError('This appointment is already booked')
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      customer_id,
      date: appointmentDate,
    })

    const formattedDate = format(appointmentDate, "dd/MM/yyyy 'às' HH'h'")

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Você possui um novo agendamento no dia ${formattedDate}`,
    })

    return appointment
  }
}

export default CreateAppointmentService
