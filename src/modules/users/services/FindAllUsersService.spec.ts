import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'

import CreateUserService from './CreateUserService'
import FindAllUsersService from './FindAllUsersService'

describe('FindAllUsers', () => {
    it('should be able get all users', async () => {
        const fakeUsersRepository = new FakeUsersRepository()
        const fakeHashProvider = new FakeHashProvider()

        const createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        )

        await createUserService.execute({
            name: 'John Doe 1',
            email: 'john1@doe.com',
            password: '123456',
        })

        await createUserService.execute({
            name: 'John Doe 2',
            email: 'john2@doe.com',
            password: '123456',
        })

        await createUserService.execute({
            name: 'John Doe 3',
            email: 'john3@doe.com',
            password: '123456',
        })

        const findAllUsersService = new FindAllUsersService(fakeUsersRepository)

        const users = await findAllUsersService.execute()

        expect(users).toHaveLength(3)
    })
})
