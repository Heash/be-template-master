import { Job } from '@app/models/job'
import { Contract } from '@app/models/contract'
import { NotFoundError } from '@app/utils/errors/notFound'
import { sequelize } from '@app/models'
import { Profile } from '@app/models/profile'

const DEPOSIT_LIMIT = 25

export class BalancesService {
  // Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
  public async deposit(clientId: number, amount: number): Promise<void> {
    const profile = await Profile.findByPk(clientId)

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
            ClientId: clientId,
            // Filter for active contracts
            status: 'in_progress',
          },
          attributes: [],
        },
      ],
    })

    const totalToPay = jobs.reduce((acc, job) => acc + job.price, 0)

    if (amount > (totalToPay * DEPOSIT_LIMIT) / 100) {
      throw new Error('Deposit limit exceeded')
    }

    await sequelize.transaction(async (transaction) => {
      await Profile.findByPk(clientId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
        skipLocked: true,
      })
      await profile.increment('balance', { by: amount, transaction })
    })
  }
}
