import { Profile } from 'model'

export {}

declare global {
  namespace Express {
    export interface Request {
      profile?: Profile
    }
  }
}
