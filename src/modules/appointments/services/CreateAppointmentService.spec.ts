import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let createAppointment: CreateAppointmentService
let date: Date

const provider_id = 'valid-provider-id'

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository)

    date = new Date()
  })

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({ provider_id, date })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe(provider_id)
  })

  it('should not be able to create two appointments on the same time', async () => {
    await createAppointment.execute({ provider_id, date })

    await expect(
      createAppointment.execute({ provider_id, date }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
