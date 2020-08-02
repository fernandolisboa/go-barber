import { Repository, getRepository, Raw } from 'typeorm'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthOfProviderDTO from '@modules/appointments/dtos/IFindAllInMonthOfProviderDTO'
import IFindAllInDayOfProviderDTO from '@modules/appointments/dtos/IFindAllInDayOfProviderDTO'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>

  constructor() {
    this.ormRepository = getRepository(Appointment)
  }

  public async findAll(): Promise<Appointment[]> {
    return await this.ormRepository.find()
  }

  public async findAllInMonthOfProvider({
    providerId: provider_id,
    month,
    year,
  }: IFindAllInMonthOfProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0')

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    })

    return appointments
  }

  public async findAllInDayOfProvider({
    providerId: provider_id,
    day,
    month,
    year,
  }: IFindAllInDayOfProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0')
    const parsedMonth = String(month).padStart(2, '0')

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
    })

    return appointments
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointment = await this.ormRepository.findOne({ where: { date } })

    return appointment
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
