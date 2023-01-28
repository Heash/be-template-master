import { Job } from '@app/models/job'
import { Contract } from '@app/models/contract'
import { NotFoundError } from '@app/utils/errors/notFound'
import { sequelize } from '@app/models'
import { Profile } from '@app/models/profile'

const DEPOSIT_LIMIT = 25

export class BalancesService {
  // Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
  public async deposit(profileId: number, amount: number): Promise<void> {
    const profile = await Profile.findByPk(profileId)

    if (!profile) {
      throw new NotFoundError('Profile not found')
    }

    const jobs = await Job.findAll({
      where: {
        paid: false,
      },
      include: [
        {
          model: Contract,
          where: {
            ProfileId: profileId,
            // Filter for active contracts
            status: 'in_progress',
          },
        },
      ],
    })

    const totalToPay = jobs.reduce((acc, job) => acc + job.price, 0)

    if (amount > totalToPay * DEPOSIT_LIMIT) {
      throw new Error('Deposit limit exceeded')
    }

    await sequelize.transaction(async (transaction) => {
      await profile.increment('balance', { by: amount, transaction })
    })
  }
}
