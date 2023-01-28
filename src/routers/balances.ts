import express, { Router } from 'express'
import { BalancesController } from '@app/controllers/balances'
import { BalancesService } from '@app/services/balances'

const balancesService = new BalancesService()
const balancesController = new BalancesController(balancesService)

export const balancesRouter: Router = express.Router()

balancesRouter.post('/deposit/:userId', async (req, res, next) =>
  balancesController.deposit(req, res, next),
)
