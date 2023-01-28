import { Contract } from '@app/models/contract'
import { NotFoundError } from '@errors/notFound'
import { Op } from 'sequelize'

export class ContractsService {
  public async getContract(id: number, profileId: number): Promise<Contract> {
    const contract = await Contract.findOne({
      where: {
        id,
        [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      },
    })
    if (!contract) throw new NotFoundError('Contract not found')

    return contract
  }

  public getContracts(profileId: number): Promise<Contract[]> {
    return (
      Contract.findAll({
        where: {
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
          [Op.not]: [{ status: 'terminated' }],
        },
      }) || []
    )
  }
}
