import 'tsconfig-paths/register'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'
import { nodeMailerHelper } from '@infra/email-sender/node-mailer/helpers/node-mailer-helper'

MongoHelper.connect(env.mongoUrl).then( async () => {
    console.log('Connected with mongodb on:', env.mongoUrl)
    const app = (await import('./config/app')).default
    await nodeMailerHelper.createTransporter()
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
}).catch(console.error)
