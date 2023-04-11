import { HttpResponse } from './index'

export interface Middleware<T = any> {
    handle: (httpRequest: T) => Promise<HttpResponse>
}