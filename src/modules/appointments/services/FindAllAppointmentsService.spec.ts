import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'
import FindAllAppointmentsService from '@modules/appointments/services/FindAllAppointmentsService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let createAppointment: CreateAppointmentService
let findAllAppointments: FindAllAppointmentsService

describe('FindAllAppointments', () => {
  beforeEach(async () => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()

    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository)
    findAllAppointments = new FindAllAppointmentsService(
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
  })

  it('should be able get all appointments', async () => {
    expect(await findAllAppointments.execute()).toHaveLength(3)
  })
})
