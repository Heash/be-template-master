import { ContractsService } from '@services/contracts'
import { NextFunction, Request, Response } from 'express'

export class ContractsController {
  constructor(
    private readonly contractsService: ContractsService = contractsService,
  ) {}

  /**
   * FIX ME!
   * @returns contract by id
   */
  public async getContract(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const contract = await this.contractsService.getContract(Number(id))

      res.json(contract)
    } catch (error) {
      next(error)
    }
  }
}
