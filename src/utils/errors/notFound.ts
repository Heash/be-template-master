import { NOT_FOUND } from 'http-status'

export class NotFoundError extends Error {
  public status = NOT_FOUND
  constructor(message: string) {
    super(message)
    this.name = 'NotFound'
  }
}
