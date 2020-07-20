import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import authConfig from '@config/auth'
import AppError from '@shared/errors/AppError'

interface ITokenPayload {
    iat: number
    exp: number
    sub: string
}

export default function ensureAuthenticated(
    request: Request,
    _response: Response,
    next: NextFunction,
): void {
    const bearerToken = request.headers.authorization

    if (!bearerToken) {
        throw new AppError('JWT token is missing', 401)
    }

    try {
        const [, token] = bearerToken.split(' ')

        const decoded = verify(token, authConfig.jwt.secret)

        const { sub } = decoded as ITokenPayload

        request.user = { id: sub }
    } catch (error) {
        throw new AppError('Invalid JWT token', 401)
    }

    return next()
}
