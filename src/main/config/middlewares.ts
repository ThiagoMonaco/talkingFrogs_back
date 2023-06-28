import { Express} from 'express'
import { cors, bodyParser, contentType } from '../middlewares'
import cookieParser from 'cookie-parser'

export default (app: Express): void => {
    app.use(bodyParser)
    app.use(cors)
    app.use(contentType)
    app.use(cookieParser())
}