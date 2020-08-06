import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'

import FindAllAppointmentsService from '@modules/appointments/services/FindAllAppointmentsService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let findAllAppointments: FindAllAppointmentsService

const provider_id = 'any-provider-id'
const customer_id = 'any-customer-id'

describe('FindAllAppointments', () => {
  beforeEach(async () => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()

    findAllAppointments = new FindAllAppointmentsService(
      fakeAppointmentsRepository,
    )

    await fakeAppointmentsRepository.create({
      provider_id,
      customer_id,
      date: new Date(2020, 6, 10, 12),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      customer_id,
      date: new Date(2020, 6, 10, 13),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      customer_id,
      date: new Date(2020, 6, 10, 14),
    })
  })

  it('should be able get all appointments', async () => {
    expect(await findAllAppointments.execute()).toHaveLength(3)
  })
})
