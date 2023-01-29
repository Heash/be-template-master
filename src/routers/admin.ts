import express, { Router } from 'express'
import { AdminController } from '@app/controllers/admin'
import { AdminService } from '@app/services/admin'

const adminService = new AdminService()
const adminController = new AdminController(adminService)

export const adminRouter: Router = express.Router()

adminRouter.get('/best-profession', async (req, res, next) =>
  adminController.getTopProfession(req, res, next),
)

adminRouter.get('/best-clients', async (req, res, next) =>
  adminController.getTopClients(req, res, next),
)
