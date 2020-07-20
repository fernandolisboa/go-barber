import { startOfHour } from 'date-fns'

import AppError from '@shared/errors/AppError'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'

type Request = Pick<Appointment, 'provider_id' | 'date'>

class CreateAppointmentService {
    constructor(private appointmentsRepository: IAppointmentsRepository) {}

    public async execute({ provider_id, date }: Request): Promise<Appointment> {
        const appointmentDate = startOfHour(date)

        const existsAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        )

        if (existsAppointmentInSameDate) {
            throw new AppError('This appointment is already booked')
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        })

        return appointment
    }
}

export default CreateAppointmentService
