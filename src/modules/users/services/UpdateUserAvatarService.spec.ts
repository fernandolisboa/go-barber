import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService'
import CreateUserService from '@modules/users/services/CreateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let fakeStorageProvider: FakeStorageProvider

let createUser: CreateUserService
let updateUserAvatar: UpdateUserAvatarService

let userId: string
const avatarFilename = 'avatar-filename.jpg'

describe('UpdateUserAvatar', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeStorageProvider = new FakeStorageProvider()

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider)

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    )

    const { id } = await createUser.execute({
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
