import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'

import ListProvidersService from '@modules/appointments/services/ListProvidersService'
import User from '@modules/users/infra/typeorm/entities/User'

let fakeUsersRepository: FakeUsersRepository

let listProviders: ListProvidersService

let user1: User
let user2: User
let user3: User

let loggedUser: User

describe('ListProviders', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()

    listProviders = new ListProvidersService(fakeUsersRepository)

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
