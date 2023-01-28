import { JobsService } from '@app/services/jobs'
import { NextFunction, Request, Response } from 'express'

export class JobsController {
  constructor(private readonly jobsService: JobsService = jobsService) {}

  public async getUnpaidJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const profileId = Number(req.get('profile_id'))

      const jobs = await this.jobsService.getUnpaidJobs(profileId)

      res.json(jobs)
    } catch (error) {
      next(error)
    }
  }

  public async payForJob(req: Request, res: Response, next: NextFunction) {
    try {
      const profileId = Number(req.get('profile_id'))
      const jobId = Number(req.params.id)

      const job = await this.jobsService.payForJob(profileId, jobId)

      res.json(job)
    } catch (error) {
      next(error)
    }
  }
}
