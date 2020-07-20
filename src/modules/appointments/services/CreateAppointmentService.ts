import { startOfHour } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import AppError from '@shared/errors/AppError'

import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

type Request = Pick<Appointment, 'provider_id' | 'date'>

class CreateAppointmentService {
    public async execute({ provider_id, date }: Request): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository,
        )

        const appointmentDate = startOfHour(date)

        const existsAppointmentInSameDate = await appointmentsRepository.findByDate(
            appointmentDate,
        )

        if (existsAppointmentInSameDate) {
            throw new AppError('This appointment is already booked')
        }

        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        })

        await appointmentsRepository.save(appointment)

        return appointment
    }
}

export default CreateAppointmentService
