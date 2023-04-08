import { HttpResponse } from '../protocols/http-response'
import { ServerError, UnauthorizedError } from '../errors'

export const badRequest = (error: Error): HttpResponse=> {
    return {
        statusCode: 400,
        body: error
    }
}

export const unauthorized = (): HttpResponse=> {
    return {
        statusCode: 401,
        body: new UnauthorizedError()
    }
}

export const serverError = (error: Error): HttpResponse=> {
    return {
        statusCode: 500,
        body: new ServerError(error?.stack)
    }
}

export const ok = (data?: any): HttpResponse=> {
    return {
        statusCode: 200,
        body: data
    }
}

export const forbidden = (message): HttpResponse=> {
    return {
        statusCode: 403,
        body: message
    }
}

export const noContent = (): HttpResponse=> {
    return {
        statusCode: 204,
        body: null
    }
}
