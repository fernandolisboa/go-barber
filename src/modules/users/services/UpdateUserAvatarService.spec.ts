import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'

import UpdateUserAvatarService from './UpdateUserAvatarService'
import CreateUserService from './CreateUserService'

describe('UpdateUserAvatar', () => {
  it('should be able to update the avatar of a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    const { id: userId } = await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    const fakeStorageProvider = new FakeStorageProvider()

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    )

    const { avatar } = await updateUserAvatar.execute({
      userId,
      avatarFilename: 'filename.jpg',
    })

    expect(avatar).toBe('filename.jpg')
  })

  it('should not be able to update avatar of non-existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider()

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    )

    const promise = updateUserAvatar.execute({
      userId: 'non-existing-user-id',
      avatarFilename: 'filename.jpg',
    })

    expect(promise).rejects.toBeInstanceOf(AppError)
  })

  it('should delete old avatar and update with the new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    const { id: userId } = await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    const fakeStorageProvider = new FakeStorageProvider()
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    )

    const firstFilename = 'first-filename.jpg'
    await updateUserAvatar.execute({
      userId,
      avatarFilename: firstFilename,
    })

    const secondFilename = 'second-filename.jpg'
    const { avatar } = await updateUserAvatar.execute({
      userId,
      avatarFilename: secondFilename,
    })

    expect(deleteFile).toHaveBeenCalledWith(firstFilename)
    expect(avatar).toBe(secondFilename)
  })
})
