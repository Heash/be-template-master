import { AdminService } from '@app/services/adminService'
import { NextFunction, Request, Response } from 'express'

export class AdminController {
  constructor(private readonly adminService: AdminService = adminService) {}
  public async getTopProfession(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const startDate = new Date(req.query.startDate as string)
      const endDate = new Date(req.query.endDate as string)

      const topProfession = await this.adminService.getTopProfession(
        startDate,
        endDate,
      )

      res.json(topProfession)
    } catch (error) {
      next(error)
    }
  }

  public async getTopClients(req: Request, res: Response, next: NextFunction) {
    try {
      const startDate = new Date(req.query.startDate as string)
      const endDate = new Date(req.query.endDate as string)
      const limit = Number(req.query.limit) || 2

      const topClients = await this.adminService.getTopClients(
        startDate,
        endDate,
        limit,
      )

      res.json(topClients)
    } catch (error) {
      next(error)
    }
  }
}
