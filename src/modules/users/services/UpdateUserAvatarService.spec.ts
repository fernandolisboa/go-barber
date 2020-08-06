import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService'

let fakeUsersRepository: FakeUsersRepository
let fakeStorageProvider: FakeStorageProvider

let updateUserAvatar: UpdateUserAvatarService

let userId: string
const avatarFilename = 'avatar-filename.jpg'

describe('UpdateUserAvatar', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeStorageProvider = new FakeStorageProvider()

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    )

    const { id } = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    userId = id
  })

  it('should be able to update the avatar of a new user', async () => {
    const { avatar } = await updateUserAvatar.execute({
      userId,
      avatarFilename,
    })

    expect(avatar).toBe(avatarFilename)
  })

  it('should not be able to update avatar of non-existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        userId: 'non-existing-user-id',
        avatarFilename,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should delete old avatar and update with the new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

    await updateUserAvatar.execute({ userId, avatarFilename })

    const newFilename = 'new-filename.jpg'

    const { avatar } = await updateUserAvatar.execute({
      userId,
      avatarFilename: newFilename,
    })

    expect(deleteFile).toHaveBeenCalledWith(avatarFilename)
    expect(avatar).toBe(newFilename)
  })
})
