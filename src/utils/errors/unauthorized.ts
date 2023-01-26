import { UNAUTHORIZED } from 'http-status'

export class UnauthorizedError extends Error {
  public status = UNAUTHORIZED
  constructor(message: string) {
    super(message)
    this.name = 'Unauthorized'
  }
}
