import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import authConfig from '../config/auth'
import AppError from '../errors/AppError'

interface TokenPayload {
    iat: number
    exp: number
    sub: string
}

export default function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    const bearerToken = request.headers.authorization

    if (!bearerToken) {
        throw new AppError('JWT token is missing', 401)
    }

    const [, token] = bearerToken.split(' ')

    try {
        const decoded = verify(token, authConfig.jwt.secret)

        const { sub } = decoded as TokenPayload

        request.user = {
            id: sub,
        }
    } catch (error) {
        throw new AppError('Invalid JWT token', 401)
    }

    return next()
}
