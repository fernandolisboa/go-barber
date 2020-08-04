import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let createAppointment: CreateAppointmentService

const provider_id = 'valid-provider-id'
const customer_id = 'valid-customer-id'

const tomorrow4pm = new Date()
tomorrow4pm.setDate(tomorrow4pm.getDate() + 1)
tomorrow4pm.setHours(16, 0, 0, 0)

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository)
  })

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      provider_id,
      customer_id,
      date: tomorrow4pm,
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe(provider_id)
  })

  it('should not be able to create two appointments on the same time', async () => {
    await createAppointment.execute({
      provider_id,
      customer_id,
      date: tomorrow4pm,
    })

    await expect(
      createAppointment.execute({
        provider_id,
        customer_id,
        date: tomorrow4pm,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create and appointment on a past date', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 3, 22, 17).getTime())

    await expect(
      createAppointment.execute({
        provider_id,
        customer_id,
        date: new Date(2020, 3, 22, 16),
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    const tomorrow7am = new Date(tomorrow4pm)
    tomorrow7am.setHours(7, 0, 0, 0)

    await expect(
      createAppointment.execute({
        provider_id,
        customer_id,
        date: tomorrow7am,
      }),
    ).rejects.toBeInstanceOf(AppError)

    const tomorrow5pm = new Date(tomorrow4pm)
    tomorrow5pm.setHours(18, 0, 0, 0)

    await expect(
      createAppointment.execute({
        provider_id,
        customer_id,
        date: tomorrow5pm,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('it should not be able to create an appointment with one user as provider and customer at the same time', async () => {
    await expect(
      createAppointment.execute({
        provider_id: 'same-user-id',
        customer_id: 'same-user-id',
        date: tomorrow4pm,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
