import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService'

let fakeAppointmentsRepository: FakeAppointmentsRepository

let listProviderDayAvailability: ListProviderDayAvailabilityService

const provider_id = 'any-provider-id'
const day = 22
const month = 4
const year = 2020

describe('ListProviderDayAvailability', () => {
  beforeEach(async () => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()

    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    )

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(2020, 3, 22, 11, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(2020, 3, 22, 12, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(2020, 3, 22, 14, 0, 0),
    })
  })

  it('should be able to list the provider´s daily availability', async () => {
    const availability = await listProviderDayAvailability.execute({
      provider_id,
      day,
      month,
      year,
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 10, available: true },
        { hour: 11, available: false },
        { hour: 12, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: true },
      ]),
    )
  })
})
