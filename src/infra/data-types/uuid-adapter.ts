import { GenerateUuid } from '@data/protocols/uuid/generate-uuid'
import { v4 as uuidv4 } from 'uuid'
export class UuidAdapter implements GenerateUuid {
    async generate() {
        return uuidv4()
    }
}