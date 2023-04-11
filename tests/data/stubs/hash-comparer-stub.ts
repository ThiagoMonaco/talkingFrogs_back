import { HashComparer } from '@data/protocols/criptography/hash-comparer'

export class HashComparerStub implements HashComparer {
    result = true
    async compare (value: string, hash: string): Promise<boolean> {
        return this.result
    }
}