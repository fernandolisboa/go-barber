import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'

import UpdateProfileService from '@modules/users/services/UpdateProfileService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider

let updateProfile: UpdateProfileService

let userId: string

const oldName = 'old-valid-name'
const oldEmail = 'old-valid-email'
const oldPassword = 'old-valid-password'

const newName = 'new-valid-name'
const newEmail = 'new-valid-email'
const newPassword = 'new-valid-password'

describe('UpdateProfile', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    const { id } = await fakeUsersRepository.create({
      name: oldName,
      email: oldEmail,
      password: oldPassword,
    })

    userId = id
  })

  it('should be able to update only the user name', async () => {
    const user = await updateProfile.execute({
      userId,
      name: newName,
      email: oldEmail,
    })

    expect(user.name).toBe(newName)
    expect(user.email).toBe(oldEmail)
    expect(user.password).toBe(oldPassword)
  })

  it('should be able to update only the user email', async () => {
    const user = await updateProfile.execute({
      userId,
      name: oldName,
      email: newEmail,
    })

    expect(user.name).toBe(oldName)
    expect(user.email).toBe(newEmail)
    expect(user.password).toBe(oldPassword)
  })

  it('should be able to update only the user password', async () => {
    const user = await updateProfile.execute({
      userId,
      name: oldName,
      email: oldEmail,
      old_password: oldPassword,
      new_password: newPassword,
    })

    expect(user.name).toBe(oldName)
    expect(user.email).toBe(oldEmail)
    expect(user.password).toBe(newPassword)
  })

  it('should be able to update the user name & email', async () => {
    const user = await updateProfile.execute({
      userId,
      name: newName,
      email: newEmail,
    })

    expect(user.name).toBe(newName)
    expect(user.email).toBe(newEmail)
    expect(user.password).toBe(oldPassword)
  })

  it('should be able to update the user name & password', async () => {
    const user = await updateProfile.execute({
      userId,
      name: newName,
      email: oldEmail,
      old_password: oldPassword,
      new_password: newPassword,
    })

    expect(user.name).toBe(newName)
    expect(user.email).toBe(oldEmail)
    expect(user.password).toBe(newPassword)
  })

  it('should be able to update the user email & password', async () => {
    const user = await updateProfile.execute({
      userId,
      name: oldName,
      email: newEmail,
      old_password: oldPassword,
      new_password: newPassword,
    })

    expect(user.name).toBe(oldName)
    expect(user.email).toBe(newEmail)
    expect(user.password).toBe(newPassword)
  })

  it('should be able to update the user name, email & password', async () => {
    const user = await updateProfile.execute({
      userId,
      name: newName,
      email: newEmail,
      old_password: oldPassword,
      new_password: newPassword,
    })

    expect(user.name).toBe(newName)
    expect(user.email).toBe(newEmail)
    expect(user.password).toBe(newPassword)
  })

  it('should not be able to update any user data if old password is wrong', async () => {
    await expect(
      updateProfile.execute({
        userId,
        name: newName,
        email: newEmail,
        old_password: 'wrong-password',
        new_password: newPassword,
      }),
    ).rejects.toBeInstanceOf(AppError)

    const user = await fakeUsersRepository.findById(userId)

    expect(user?.name).toBe(oldName)
    expect(user?.email).toBe(oldEmail)
    expect(user?.password).toBe(oldPassword)
  })

  it('should not be able to update any user data if old password is provided, but new password is not', async () => {
    await expect(
      updateProfile.execute({
        userId,
        name: newName,
        email: newEmail,
        old_password: oldPassword,
      }),
    ).rejects.toBeInstanceOf(AppError)

    const user = await fakeUsersRepository.findById(userId)

    expect(user?.name).toBe(oldName)
    expect(user?.email).toBe(oldEmail)
    expect(user?.password).toBe(oldPassword)
  })

  it('should not be able to update any user data if new password is provided, but old password is not', async () => {
    await expect(
      updateProfile.execute({
        userId,
        name: newName,
        email: newEmail,
        new_password: newPassword,
      }),
    ).rejects.toBeInstanceOf(AppError)

    const user = await fakeUsersRepository.findById(userId)

    expect(user?.name).toBe(oldName)
    expect(user?.email).toBe(oldEmail)
    expect(user?.password).toBe(oldPassword)
  })

  it('should not be able to update the user email with one that is already in use', async () => {
    const sameEmail = 'same@email.com'

    await fakeUsersRepository.create({
      name: 'Other user',
      email: sameEmail,
      password: 'other-password',
    })

    await expect(
      updateProfile.execute({
        userId,
        name: newName,
        email: sameEmail,
      }),
    ).rejects.toBeInstanceOf(AppError)

    const user = await fakeUsersRepository.findById(userId)

    expect(user?.name).toBe(oldName)
    expect(user?.email).toBe(oldEmail)
    expect(user?.password).toBe(oldPassword)
  })

  it('should not be able to update the profile of a non-existing user', async () => {
    await expect(
      updateProfile.execute({
        userId: 'non-existing-user-id',
        name: newName,
        email: newEmail,
        old_password: oldPassword,
        new_password: newPassword,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
