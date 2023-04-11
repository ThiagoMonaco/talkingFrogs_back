import request from 'supertest'
import app from '@main/config/app'

describe('Middleware body parser', function () {
    test('Should parse body from request correctly', async () => {
        app.post('/test_body_parser', (req, res) => {
            res.send(req.body)
        })

        await request(app)
            .post('/test_body_parser')
            .send({ name: 'test' })
            .expect({ name: 'test' })
    })
})