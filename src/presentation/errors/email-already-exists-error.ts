export class EmailAlreadyExistsError extends Error{
    constructor() {
        super('Email already in use')
        this.name = 'EmailAlreadyExistsError'
        this.message = 'Email already in use'
    }
}