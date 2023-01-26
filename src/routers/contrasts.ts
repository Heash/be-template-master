import express, { Router } from 'express'
import { ContractsController } from '@controllers/contracts'
import { ContractsService } from '@services/contracts'
import { getProfile } from '@middlewares/getProfile'

const contractsService = new ContractsService()
const contractsController = new ContractsController(contractsService)

export const contractsRouter: Router = express.Router()

contractsRouter.get('/:id', getProfile, async (req, res, next) =>
  contractsController.getContract(req, res, next),
)
