import { Request, Response, NextFunction } from 'express'
import env from '@main/config/env'

export const cors = (req: Request, res: Response, next: NextFunction): void => {
    res.set('Access-Control-Allow-Origin', env.client_url)
    res.set('access-control-allow-headers', 'Content-Type, *')
    res.set('access-control-allow-methods', '*')
    res.set('access-control-allow-credentials', 'true')
    next()
}