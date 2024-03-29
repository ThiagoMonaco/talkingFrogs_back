import request from 'supertest'
import app from '@main/config/app'

describe('Middleware CORS test', function () {
    test('Should enable cors', async () => {
        app.get('/test_cors', (req, res) => {
            res.send()
        })

        await request(app)
            .get('/test_cors')
            .expect('access-control-allow-headers', 'Content-Type, *')
            .expect('access-control-allow-methods', '*')
            .expect('access-control-allow-credentials', 'true')
    })
})