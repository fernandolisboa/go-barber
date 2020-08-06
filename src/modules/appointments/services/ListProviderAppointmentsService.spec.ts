import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let fakeCacheProvider: FakeCacheProvider

let listProviderAppointments: ListProviderAppointmentsService

const provider_id = 'any-provider-id'
const customer_id = 'any-customer-id'

const day = 22
const month = 4
const year = 2020

let appointment1: Appointment
let appointment2: Appointment
let appointment3: Appointment
let appointment4: Appointment

describe('ListProviderAppointments', () => {
  beforeEach(async () => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    fakeCacheProvider = new FakeCacheProvider()

    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    )

    appointment1 = await fakeAppointmentsRepository.create({
      provider_id,
      customer_id,
      date: new Date(2020, 3, 22, 8, 0, 0),
    })

    appointment2 = await fakeAppointmentsRepository.create({
      provider_id,
      customer_id,
      date: new Date(2020, 3, 22, 9, 0, 0),
    })

    appointment3 = await fakeAppointmentsRepository.create({
      provider_id,
      customer_id,
      date: new Date(2020, 3, 22, 15, 0, 0),
    })

    appointment4 = await fakeAppointmentsRepository.create({
      provider_id,
      customer_id,
      date: new Date(2020, 3, 22, 17, 0, 0),
    })
  })

  it('should be able to list the provider appointments of a specific day', async () => {
    const availability = await listProviderAppointments.execute({
      provider_id,
      day,
      month,
      year,
    })

    expect(availability).toEqual([
      appointment1,
      appointment2,
      appointment3,
      appointment4,
    ])
  })
})
