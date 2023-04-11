import { Request, Response } from 'express'
import { Controller } from '@presentation/protocols'

export const adaptRoute = (controller: Controller) => {
    return async (req: Request, res: Response) => {
        const httpRequest = {
            ...(req.body || {}),
            ...(req.params || {}),
            accountId: req.accountId
        }
        const httpResponse = await controller.handle(httpRequest)
        res.status(httpResponse.statusCode)
        if(httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
            res.json(httpResponse.body)
        } else {
            res.json({
                error: httpResponse.body.message
            })
        }
    }
}