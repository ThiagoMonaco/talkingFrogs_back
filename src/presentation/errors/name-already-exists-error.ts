export class NameAlreadyExistsError extends Error{
    constructor() {
        super('Name already in use')
        this.name = 'NameAlreadyExistsError'
        this.message = 'Name already in use'
    }
}