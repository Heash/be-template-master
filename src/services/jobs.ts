import { Job } from '@app/models/job'
import { Contract } from '@app/models/contract'
import { NotFoundError } from '@app/utils/errors/notFound'
import { sequelize } from '@app/models'
import { Profile } from '@app/models/profile'
import { Op } from 'sequelize'

export class JobsService {
  public async getUnpaidJobs(profileId: number): Promise<Job[]> {
    const jobs = await Job.findAll({
      where: {
        paid: false,
      },
      include: [
        {
          model: Contract,
          where: {
            [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
            status: 'in_progress',
          },
          attributes: [],
        },
      ],
    })

    return jobs
  }

  // Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.
  public async payForJob(profileId: number, jobId: number): Promise<void> {
    // Start a transaction
    const transaction = await sequelize.transaction()

    try {
      // Find job
      const job = await Job.findOne({
        lock: transaction.LOCK.UPDATE,
        skipLocked: true,
        where: {
          id: jobId,
          paid: false,
        },
        include: [
          {
            model: Contract,
            attributes: ['id'],
          },
        ],
      })
      if (!job) throw new NotFoundError('Job not found')
      const { price } = job

      const client = await Profile.findOne({
        lock: transaction.LOCK.UPDATE,
        skipLocked: true,
        where: {
          id: profileId,
        },
      })
      if (!client) throw new NotFoundError('Client not found')

      // Check if there is enough balance
      if (client.balance < price) throw new Error('Not enough balance')

      // Pay for job
      await client.decrement('balance', { by: price, transaction })
      await job.update({ paid: true, paymentDate: new Date() }, { transaction })

      // Commit the transaction
      await transaction.commit()
    } catch (error) {
      // Rollback the transaction if any errors were encountered
      await transaction.rollback()
      throw error
    }
  }
}
