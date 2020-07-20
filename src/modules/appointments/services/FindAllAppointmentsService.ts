import { injectable, inject } from 'tsyringe'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'

@injectable()
class FindAllAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute(): Promise<Appointment[]> {
        const appointments = await this.appointmentsRepository.findAll()
        return appointments
    }
}

export default FindAllAppointmentsService
