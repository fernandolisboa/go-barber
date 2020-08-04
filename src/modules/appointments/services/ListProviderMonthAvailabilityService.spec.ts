import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService'

let fakeAppointmentsRepository: FakeAppointmentsRepository

let listProviderMonthAvailability: ListProviderMonthAvailabilityService

const provider_id = 'any-provider-id'
const customer_id = 'any-customer-id'

const month = 4
const year = 2020

describe('ListProviderMonthAvailability', () => {
  beforeEach(async () => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()

    await fakeAppointmentsRepository.create({
      provider_id,
      customer_id,
      date: new Date(year, month - 1, 21, 12, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      customer_id,
      date: new Date(year, month - 1, 21, 17, 0, 0),
    })

    for (let i = 0; i < 10; i++) {
      await fakeAppointmentsRepository.create({
        provider_id,
        customer_id,
        date: new Date(year, month - 1, 22, 8 + i, 0, 0),
      })
    }

    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    )
  })

  it("should be able to list the provider's month availability", async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(year, month - 1, 21, 8).getTime())

    const availability = await listProviderMonthAvailability.execute({
      provider_id,
      month,
      year,
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: false },
        { day: 23, available: true },
      ]),
    )
  })
})
