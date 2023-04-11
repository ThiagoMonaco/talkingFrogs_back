export class InvalidParamError extends Error{
    constructor(param: string) {
        super('Invalid params: ' + param)
        this.name = 'InvalidParamError'
        this.message = 'Invalid params: ' + param
    }
}