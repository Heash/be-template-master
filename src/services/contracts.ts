import { Contract } from '@app/model'
import { NotFoundError } from '@app/utils/errors/notFound'

export class ContractsService {
  public async getContract(id: number): Promise<Contract> {
    const contract = await Contract.findOne({ where: { id } })
    if (!contract) throw new NotFoundError('Contract not found')

    return contract
  }
}
