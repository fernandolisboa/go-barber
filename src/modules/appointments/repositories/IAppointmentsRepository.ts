import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

interface IAppointmentsRepository {
    findAll(): Promise<Appointment[]>
    findByDate(date: Date): Promise<Appointment | undefined>
    create(data: ICreateAppointmentDTO): Promise<Appointment>
}

export default IAppointmentsRepository
