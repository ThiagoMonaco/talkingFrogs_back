import { Cookie } from '@presentation/protocols/cookie'

export interface HttpResponse {
    body: any,
    statusCode: number,
    error?: Error
    cookies?: Cookie[]
}