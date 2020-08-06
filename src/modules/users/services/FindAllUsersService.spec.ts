import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'

import FindAllUsersService from '@modules/users/services/FindAllUsersService'

let fakeUsersRepository: FakeUsersRepository

let findAllUsers: FindAllUsersService

describe('FindAllUsers', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()

    findAllUsers = new FindAllUsersService(fakeUsersRepository)

    const password = '123456'

    await fakeUsersRepository.create({
      name: 'New user 1',
      email: 'valid-1@email.com',
      password,
    })

    await fakeUsersRepository.create({
      name: 'New user 2',
      email: 'valid-2@email.com',
      password,
    })

    await fakeUsersRepository.create({
      name: 'New user 3',
      email: 'valid-3@email.com',
      password,
    })
  })

  it('should be able get all users', async () => {
    expect(await findAllUsers.execute()).toHaveLength(3)
  })
})
