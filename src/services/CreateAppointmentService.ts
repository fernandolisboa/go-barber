import { startOfHour } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import AppointmentsRepository from '../repositories/AppointmentsRepository'
import Appointment from '../models/Appointment'

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
            throw new Error('This appointment is already booked')
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
