import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'

import CreateAppointmentService from './CreateAppointmentService'
import FindAllAppointmentsService from './FindAllAppointmentsService'

describe('FindAllAppointments', () => {
    it('should be able get all appointments', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository()

        const createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
        )

        const provider_id = 'random-provider-id'

        await createAppointmentService.execute({
            provider_id,
            date: new Date(2020, 6, 10, 12),
        })

        await createAppointmentService.execute({
            provider_id,
            date: new Date(2020, 6, 10, 13),
        })

        await createAppointmentService.execute({
            provider_id,
            date: new Date(2020, 6, 10, 14),
        })

        const findAllAppointmentsService = new FindAllAppointmentsService(
            fakeAppointmentsRepository,
        )

        const appointments = await findAllAppointmentsService.execute()

        expect(appointments).toHaveLength(3)
    })
})
