import { Contract } from '@app/models/contract'
import { Job } from '@app/models/job'
import { Profile } from '@app/models/profile'
import { col, fn, Op } from 'sequelize'

export interface TopClient {
  id: number
  fullName: string
  paid: number
}

export class AdminService {
  // Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
  public async getTopProfession(
    startDate: Date,
    endDate: Date,
  ): Promise<string> {
    // Get top job
    const topJob = await Job.findAll({
      where: {
        paymentDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: ['ContractorId', [fn('sum', col('price')), 'total']],
      group: ['ContractorId'],
      order: [[fn('sum', col('price')), 'DESC']],
      limit: 1,
    })

    const { ContractId } = topJob[0]

    // Get contract
    const contract = await Contract.findByPk(ContractId, {
      attributes: ['ContractorId'],
    })
    if (!contract) throw new Error('Contract not found')

    // Get contractor
    const contractor = await Profile.findByPk(contract.ContractorId, {
      attributes: ['profession'],
    })

    // Return profession
    return contractor?.profession || ''
  }

  // returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
  public async getTopClients(
    startDate: Date,
    endDate: Date,
    limit: number,
  ): Promise<TopClient[]> {
    // Get top jobs
    const topJobs: any[] = await Job.findAll({
      where: {
        paymentDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: ['ClientId', [fn('sum', col('price')), 'total']],
      group: ['ClientId'],
      order: [[fn('sum', col('price')), 'DESC']],
      raw: true,
      limit,
    })

    // Get contracts
    const contractIds = topJobs.map((job) => job.ContractId)
    const contracts = await Contract.findAll({
      where: {
        id: {
          [Op.in]: contractIds,
        },
      },
    })

    // Get clients
    const clientIds = contracts.map((contract) => contract.ClientId)
    const clients = await Profile.findAll({
      where: {
        id: {
          [Op.in]: clientIds,
        },
      },
    })

    // Map top clients
    const topClients: TopClient[] = topJobs.map((job) => {
      const contract = contracts.find(
        (contract) => contract.id === job.ContractId,
      )
      const client = clients.find((client) => client.id === contract?.ClientId)
      return {
        id: client?.id || 0,
        fullName: `${client?.firstName} ${client?.lastName}`,
        paid: job.total,
      }
    })

    // Return top clients
    return topClients
  }
}
