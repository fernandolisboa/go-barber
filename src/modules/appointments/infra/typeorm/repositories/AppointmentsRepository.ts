import { Repository, getRepository } from 'typeorm'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>

    constructor() {
        this.ormRepository = getRepository(Appointment)
    }

    public async findAll(): Promise<Appointment[]> {
        return await this.ormRepository.find()
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const appointmentFound = await this.ormRepository.findOne({
            where: { date },
        })

        return appointmentFound
    }

    public async create(
        appointmentData: ICreateAppointmentDTO,
    ): Promise<Appointment> {
        const appointment = this.ormRepository.create(appointmentData)

        await this.ormRepository.save(appointment)

        return appointment
    }
}

export default AppointmentsRepository
