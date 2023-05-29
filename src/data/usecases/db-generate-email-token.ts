import { GenerateEmailToken } from '@domain/usecases/generate-email-token'
import { GenerateUuid } from '@data/protocols/uuid/generate-uuid'
import { GenerateEmailTokenRepository } from '@data/protocols/db/account/generate-email-token-repository'

export class DbGenerateEmailToken implements GenerateEmailToken {
  constructor (
    private readonly generateEmailTokenRepository: GenerateEmailTokenRepository,
    private readonly generateUuid: GenerateUuid
  ) {}

  async generateEmailToken(email: GenerateEmailToken.Params): Promise<GenerateEmailToken.Result> {
    const uuid = await this.generateUuid.generate()
    if(!uuid) {
      return null
    }
    return await this.generateEmailTokenRepository.generate({
      email: email,
      uuid: uuid
    })
  }
}