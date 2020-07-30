import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'

import ShowProfileService from '@modules/users/services/ShowProfileService'

let fakeUsersRepository: FakeUsersRepository

let showProfile: ShowProfileService

let userId: string

const name = 'Any user'
const username = 'any'
const email = 'any@email.com'
const password = 'any-password'

describe('ShowProfile', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()

    const { id } = await fakeUsersRepository.create({
      name,
      username,
      email,
      password,
    })

    userId = id

    showProfile = new ShowProfileService(fakeUsersRepository)
  })

  it('should be able to update the avatar of a new user', async () => {
    const user = await showProfile.execute({ userId })

    expect(user.id).toBe(userId)
    expect(user.name).toBe(name)
    expect(user.email).toBe(email)
  })

  it('should not be able to update avatar of non-existing user', async () => {
    await expect(
      showProfile.execute({ userId: 'non-existing-user-id' }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
