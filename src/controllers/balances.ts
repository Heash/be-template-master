import { BalancesService } from '@app/services/balances'
import { NextFunction, Request, Response } from 'express'

export class BalancesController {
  constructor(
    private readonly balancesService: BalancesService = balancesService,
  ) {}

  public async deposit(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.userId)
      const { amount } = req.body

      const balance = await this.balancesService.deposit(userId, amount)

      res.json(balance)
    } catch (error) {
      next(error)
    }
  }
}
