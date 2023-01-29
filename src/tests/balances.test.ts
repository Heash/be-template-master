import { app } from '@app/app'
import { sequelize } from '@app/models'
import { Server } from 'http'
import request from 'supertest'

let server: Server
const { Contract, Profile, Job } = sequelize.models

describe('Balances', () => {
  beforeAll(async () => {
    server = app.listen(process.env.PORT)

    await Profile.sync({ force: true })
    await Contract.sync({ force: true })
    await Job.sync({ force: true })
  })

  afterAll(async () => {
    server.close()
  })

  afterEach(async () => {
    // clear database
    await Contract.destroy({ where: {}, truncate: true })
    await Profile.destroy({ where: {}, truncate: true })
    await Job.destroy({ where: {}, truncate: true })
  })

  describe('POST /balances/deposit/:userId', () => {
    it('should not deposit money to the user balance if amount is more than 25% of jobs to pay', async () => {
      // create a profile (contractor)
      await Profile.create({
        id: 10,
        type: 'contractor',
        firstName: 'John',
        lastName: 'Doe',
        profession: 'plumber',
      })

      // create a profile (client)
      await Profile.create({
        id: 20,
        type: 'client',
        firstName: 'Jane',
        lastName: 'Doe',
        balance: 100,
        profession: 'driver',
      })

      // create contracts
      await Contract.create({
        id: 101,
        ContractorId: 10,
        ClientId: 20,
        status: 'in_progress',
        terms: 'contract terms',
      })

      await Contract.create({
        id: 102,
        ContractorId: 10,
        ClientId: 20,
        status: 'in_progress',
        terms: 'contract terms',
      })

      // create jobs
      await Job.create({
        id: 1001,
        ContractId: 101,
        description: 'job description',
        paid: false,
        price: 100,
        status: 'in_progress',
      })

      await Job.create({
        id: 1002,
        ContractId: 102,
        description: 'job description',
        paid: false,
        price: 100,
        status: 'in_progress',
      })

      // deposit money to the client
      const res = await request(server)
        .post('/balances/deposit/20')
        .send({ amount: 51 })
      const profile = await Profile.findOne({ where: { id: 20 } })

      expect(res.status).not.toEqual(200)
      expect((profile as any).balance).toEqual(100)
    })

    it('should deposit money to the user balance', async () => {
      // create a profile (contractor)
      await Profile.create({
        id: 10,
        type: 'contractor',
        firstName: 'John',
        lastName: 'Doe',
        profession: 'plumber',
      })

      // create a profile (client)
      await Profile.create({
        id: 20,
        type: 'client',
        firstName: 'Jane',
        lastName: 'Doe',
        balance: 100,
        profession: 'driver',
      })

      // create contracts
      await Contract.create({
        id: 101,
        ContractorId: 10,
        ClientId: 20,
        status: 'in_progress',
        terms: 'contract terms',
      })

      await Contract.create({
        id: 102,
        ContractorId: 10,
        ClientId: 20,
        status: 'in_progress',
        terms: 'contract terms',
      })

      // create jobs
      await Job.create({
        id: 1001,
        ContractId: 101,
        description: 'job description',
        paid: false,
        price: 100,
        status: 'in_progress',
      })

      await Job.create({
        id: 1002,
        ContractId: 102,
        description: 'job description',
        paid: false,
        price: 100,
        status: 'in_progress',
      })

      // deposit money to the client
      const res = await request(server)
        .post('/balances/deposit/20')
        .send({ amount: 50 })
      const profile = await Profile.findOne({ where: { id: 20 } })

      expect(res.status).toEqual(200)
      expect((profile as any).balance).toEqual(150)
    })
  })
})
