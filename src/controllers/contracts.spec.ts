import { Request, Response } from 'express'
import { ContractsController } from './contracts'

describe('Jest', () => {
  it('returns a contract', async () => {
    const contract = { id: 1, name: 'John Doe' }
    const mock = jest.fn().mockResolvedValue(contract)
    const service = { getContract: mock }
    const controller = new ContractsController(service)
    const req = { params: { id: 1 } }
    const res = { json: jest.fn() }
    const next = jest.fn()

    await controller.getContract(
      req as unknown as Request,
      res as unknown as Response,
      next,
    )

    expect(mock).toHaveBeenCalledWith(1)
    expect(res.json).toHaveBeenCalledWith(contract)
    expect(next).not.toHaveBeenCalled()
  })
})
