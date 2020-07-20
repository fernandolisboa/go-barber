import { uuid } from 'uuidv4'
import { isEqual } from 'date-fns'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

class FakeAppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = []

    public async findAll(): Promise<Appointment[]> {
        return this.appointments
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const appointmentFound = this.appointments.find(appointment =>
            isEqual(appointment.date, date),
        )

        return appointmentFound
    }

    public async create(
        appointmentData: ICreateAppointmentDTO,
    ): Promise<Appointment> {
        const appointment = new Appointment()

        Object.assign(appointment, { id: uuid() }, appointmentData)

        this.appointments.push(appointment)

        return appointment
    }
}

export default FakeAppointmentsRepository
