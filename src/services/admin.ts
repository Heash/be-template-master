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
      include: [
        {
          model: Contract,
          attributes: ['ContractorId'],
        },
      ],
      attributes: ['ContractId', [fn('sum', col('price')), 'total']],
      group: ['contract.ContractorId'],
      order: [[fn('sum', col('price')), 'DESC']],
      limit: 1,
    })

    const contractorId = topJob[0]?.contract?.ContractorId

    // Get contractor
    const contractor = await Profile.findByPk(contractorId, {
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
  ): Promise<TopClient[] | undefined> {
    // Get top clients based on jobs total paid
    const topClientsRes = await Job.findAll({
      where: {
        paymentDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Contract,
          attributes: ['ClientId'],
        },
      ],
      attributes: ['ContractId', [fn('sum', col('price')), 'total']],
      group: ['contract.ClientId'],
      order: [[fn('sum', col('price')), 'DESC']],
      limit,
    })

    // // Get clients
    const clientIds = topClientsRes.map((item) => item?.contract?.ClientId)
    const clients = await Profile.findAll({
      where: {
        id: {
          [Op.in]: clientIds,
        },
      },
    })

    // Map top clients
    const topClientsResult: TopClient[] = topClientsRes.map((item) => {
      const client = clients.find(
        (client) => client.id === item?.contract?.ClientId,
      )

      return {
        id: item?.contract?.ClientId as number,
        fullName: `${client?.firstName} ${client?.lastName}`,
        paid: item.dataValues.total,
      }
    })

    // Return top clients
    return topClientsResult
  }
}
