import { app } from '@app/app'
import { sequelize } from '@app/models'
import { Server } from 'http'
import request from 'supertest'

let server: Server
const { Contract, Profile, Job } = sequelize.models

describe('Jobs', () => {
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

  describe('GET /jobs/unpaid', () => {
    it('should return the unpaid jobs only to the contractor', async () => {
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
        firstName: 'Steve',
        lastName: 'Jobs',
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
        paid: true,
        description: 'job description',
        price: 100,
      })

      await Job.create({
        id: 1002,
        ContractId: 101,
        paid: false,
        description: 'job description',
        price: 100,
      })

      const response = await request(server)
        .get('/jobs/unpaid')
        .set('profile_id', '10')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: 1002,
          paid: false,
          description: 'job description',
        }),
      ])
    })

    it('should return the unpaid jobs only to the client', async () => {
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
        firstName: 'Steve',
        lastName: 'Jobs',
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
        paid: true,
        description: 'job description',
        price: 100,
      })

      await Job.create({
        id: 1002,
        ContractId: 101,
        paid: false,
        description: 'job description',
        price: 100,
      })

      const response = await request(server)
        .get('/jobs/unpaid')
        .set('profile_id', '20')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          id: 1002,
          paid: false,
          description: 'job description',
        }),
      ])
    })

    it('should return 401 if the profile_id is not provided', async () => {
      const response = await request(server).get('/jobs/unpaid')

      expect(response.status).toBe(401)
    })
  })

  describe('POST /jobs/:id/pay', () => {
    it('should pay the job', async () => {
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
        firstName: 'Steve',
        lastName: 'Jobs',
        balance: 133,
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
        paid: true,
        description: 'job description',
        price: 100,
      })

      await Job.create({
        id: 1002,
        ContractId: 101,
        paid: false,
        description: 'job description',
        price: 100,
      })

      const response = await request(server)
        .post('/jobs/1002/pay')
        .set('profile_id', '20')

      const jobAfter = await Job.findByPk(1002)
      const profileAfter = await Profile.findByPk(20)

      expect(response.status).toBe(200)
      expect((jobAfter as any).paid).toBe(true)
      expect((profileAfter as any).balance).toBe(33)
    })

    it('should not pay if client does not have enough money', async () => {
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
        firstName: 'Steve',
        lastName: 'Jobs',
        balance: 133,
        profession: 'driver',
      })

      // create a contract
      await Contract.create({
        id: 101,
        ContractorId: 10,
        ClientId: 20,
        status: 'in_progress',
        terms: 'contract terms',
      })

      // create job
      await Job.create({
        id: 1001,
        ContractId: 101,
        paid: false,
        description: 'job description',
        price: 200,
      })

      const response = await request(server)
        .post('/jobs/1001/pay')
        .set('profile_id', '20')

      const jobAfter = await Job.findByPk(1001)
      const profileAfter = await Profile.findByPk(20)

      expect(response.status).not.toBe(200)

      expect((jobAfter as any).paid).toBe(false)
      expect((profileAfter as any).balance).toBe(133)
    })

    it('should return 401 if the profile_id is not provided', async () => {
      const response = await request(server).post('/jobs/1002/pay')

      expect(response.status).toBe(401)
    })
  })
})
