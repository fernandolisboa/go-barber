import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    )

    const provider_id = '123123'
    const date = new Date()

    const appointment = await createAppointment.execute({
      provider_id,
      date,
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe(provider_id)
  })

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    )

    const date = new Date()

    await createAppointment.execute({
      provider_id: 'provider 1',
      date,
    })

    const promise = createAppointment.execute({
      provider_id: 'provider 2',
      date,
    })

    await expect(promise).rejects.toBeInstanceOf(AppError)
  })
})
