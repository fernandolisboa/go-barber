import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'
import FindAllAppointmentsService from '@modules/appointments/services/FindAllAppointmentsService'

describe('FindAllAppointments', () => {
  it('should be able get all appointments', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()

    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    )

    const provider_id = 'random-provider-id'

    await createAppointment.execute({
      provider_id,
      date: new Date(2020, 6, 10, 12),
    })

    await createAppointment.execute({
      provider_id,
      date: new Date(2020, 6, 10, 13),
    })

    await createAppointment.execute({
      provider_id,
      date: new Date(2020, 6, 10, 14),
    })

    const findAllAppointments = new FindAllAppointmentsService(
      fakeAppointmentsRepository,
    )

    const appointments = await findAllAppointments.execute()

    expect(appointments).toHaveLength(3)
  })
})
