import { Router } from 'express'
import { container } from 'tsyringe'

import CreateSessionService from '@modules/users/services/CreateSessionService'

const sessionsRouter = Router()

sessionsRouter.get('/', async (_, res) => res.json({ ok: true }))

sessionsRouter.post('/', async (request, response) => {
    const { login, password } = request.body

    const createSession = container.resolve(CreateSessionService)

    const { user, token } = await createSession.execute({ login, password })

    delete user.password

    return response.json({ user, token })
})

export default sessionsRouter
