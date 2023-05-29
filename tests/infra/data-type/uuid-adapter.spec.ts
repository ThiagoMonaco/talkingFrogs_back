import { UuidAdapter } from '@infra/data-types/uuid-adapter'
import uuid from 'uuid'

jest.mock('uuid', () => ({
    async v4 (): Promise<string> {
        return new Promise(resolve => resolve('token'))
    }
}))

describe('Uuid adapter', () => {
    test('should call v4 with correct values', async () => {
        const sut = new UuidAdapter()
        const v4Spy = jest.spyOn(uuid, 'v4')
        await sut.generate()
        expect(v4Spy).toHaveBeenCalledWith()
    })
})