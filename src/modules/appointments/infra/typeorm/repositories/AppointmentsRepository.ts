import { Repository, getRepository } from 'typeorm'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>

    constructor() {
        this.ormRepository = getRepository(Appointment)
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const appointmentFound = await this.ormRepository.findOne({
            where: { date },
        })

        return appointmentFound
    }

    public async create(data: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create(data)

        await this.ormRepository.save(appointment)

        return appointment
    }
}

export default AppointmentsRepository
