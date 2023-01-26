import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../utils/errors/unauthorized'

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { Profile } = req.app.get('models')
    const profileId = req.get('profile_id')

    if (!profileId) throw new UnauthorizedError("Profile ID doesn't exist")

    const profile = await Profile.findOne({
      where: { id: profileId },
    })
    if (!profile) throw new UnauthorizedError("Profile doesn't exist")

    req.profile = profile
    next()
  } catch (error) {
    next(error)
  }
}
