import { JobsController } from '@app/controllers/jobs'
import { JobsService } from '@app/services/jobs'
import express, { Router } from 'express'

const jobsService = new JobsService()
const jobsController = new JobsController(jobsService)

export const jobsRouter: Router = express.Router()

jobsRouter.get('/unpaid', async (req, res, next) =>
  jobsController.getUnpaidJobs(req, res, next),
)

jobsRouter.post('/:id/pay', async (req, res, next) =>
  jobsController.payForJob(req, res, next),
)
