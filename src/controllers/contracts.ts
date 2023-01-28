import { ContractsService } from '@services/contracts'
import { NextFunction, Request, Response } from 'express'

export class ContractsController {
  constructor(
    private readonly contractsService: ContractsService = contractsService,
  ) {}

  public async getContract(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      const profileId = Number(req.get('profile_id'))

      const contract = await this.contractsService.getContract(id, profileId)

      res.json(contract)
    } catch (error) {
      next(error)
    }
  }

  public async getContracts(req: Request, res: Response, next: NextFunction) {
    try {
      const profileId = req.get('profile_id')

      const contracts = await this.contractsService.getContracts(
        Number(profileId),
      )

      res.json(contracts)
    } catch (error) {
      next(error)
    }
  }
}
