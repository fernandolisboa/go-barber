import { Router } from 'express'
import CreateSessionService from '../services/CreateSessionService'

const sessionsRouter = Router()

sessionsRouter.get('/', async (_request, response) => {
    return response.json({ ok: true })
})

sessionsRouter.post('/', async (request, response) => {
    const { login, password } = request.body

    const createSession = new CreateSessionService()

    const { user, token } = await createSession.execute({ login, password })

    delete user.password

    return response.json({ user, token })
})

export default sessionsRouter
