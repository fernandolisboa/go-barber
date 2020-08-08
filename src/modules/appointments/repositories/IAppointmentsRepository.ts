import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthOfProviderDTO from '@modules/appointments/dtos/IFindAllInMonthOfProviderDTO'
import IFindAllInDayOfProviderDTO from '@modules/appointments/dtos/IFindAllInDayOfProviderDTO'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

interface IAppointmentsRepository {
  findAll(): Promise<Appointment[]>
  findAllInMonthOfProvider(
    data: IFindAllInMonthOfProviderDTO,
  ): Promise<Appointment[]>
  findAllInDayOfProvider(
    data: IFindAllInDayOfProviderDTO,
  ): Promise<Appointment[]>
  findByDateOfProvider(
    provider_id: string,
    date: Date,
  ): Promise<Appointment | undefined>
  create(data: ICreateAppointmentDTO): Promise<Appointment>
}

export default IAppointmentsRepository
