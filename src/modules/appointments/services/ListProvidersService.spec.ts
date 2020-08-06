import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

import User from '@modules/users/infra/typeorm/entities/User'

import ListProvidersService from '@modules/appointments/services/ListProvidersService'

let fakeUsersRepository: FakeUsersRepository
let fakeCacheProvider: FakeCacheProvider

let listProviders: ListProvidersService

let user1: User
let user2: User
let user3: User

let loggedUser: User

describe('ListProviders', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeCacheProvider = new FakeCacheProvider()

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    )

    const password = 'any-password'

    user1 = await fakeUsersRepository.create({
      name: 'Any user 1',
      email: 'any-1@email.com',
      password,
    })

    user2 = await fakeUsersRepository.create({
      name: 'Any user 2',
      email: 'any-2@email.com',
      password,
    })

    user3 = await fakeUsersRepository.create({
      name: 'Any user 3',
      email: 'any-3@email.com',
      password,
    })

    loggedUser = await fakeUsersRepository.create({
      name: 'Logged user',
      email: 'logged_user@email.com',
      password,
    })
  })

  it('should be able to list all providers', async () => {
    const providers = await listProviders.execute({ userId: loggedUser.id })

    expect(providers).toHaveLength(3)
    expect(providers).toEqual([user1, user2, user3])
  })
})
