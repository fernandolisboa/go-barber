import { uuid } from 'uuidv4'
import { isEqual, getDate, getMonth, getYear } from 'date-fns'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthOfProviderDTO from '@modules/appointments/dtos/IFindAllInMonthOfProviderDTO'
import IFindAllInDayOfProviderDTO from '@modules/appointments/dtos/IFindAllInDayOfProviderDTO'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = []

  public async findAll(): Promise<Appointment[]> {
    return this.appointments
  }

  public async findAllInMonthOfProvider({
    providerId,
    month,
    year,
  }: IFindAllInMonthOfProviderDTO): Promise<Appointment[]> {
    const appointmentFound = this.appointments.filter(
      ({ provider_id, date }) =>
        provider_id === providerId &&
        getMonth(date) + 1 === month &&
        getYear(date) === year,
    )

    return appointmentFound
  }

  public async findAllInDayOfProvider({
    providerId,
    day,
    month,
    year,
  }: IFindAllInDayOfProviderDTO): Promise<Appointment[]> {
    const appointmentFound = this.appointments.filter(
      ({ provider_id, date }) =>
        provider_id === providerId &&
        getDate(date) === day &&
        getMonth(date) + 1 === month &&
        getYear(date) === year,
    )

    return appointmentFound
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
