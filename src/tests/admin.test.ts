import { app } from '@app/app'
import { sequelize } from '@app/models'
import { Server } from 'http'
import request from 'supertest'

let server: Server
const { Contract, Profile, Job } = sequelize.models

describe('Admin', () => {
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

  describe('GET /admin/best-profession?start=<date>&end=<date>', () => {
    it('should return the best profession in the given period', async () => {
      // create profiles (contractor)
      await Profile.create({
        id: 10,
        type: 'contractor',
        firstName: 'John',
        lastName: 'Doe',
        profession: 'plumber',
      })

      await Profile.create({
        id: 11,
        type: 'contractor',
        firstName: 'John',
        lastName: 'Doe',
        profession: 'cook',
      })

      await Profile.create({
        id: 12,
        type: 'contractor',
        firstName: 'John',
        lastName: 'Doe',
        profession: 'cook',
      })

      // create profiles (client)
      await Profile.create({
        id: 20,
        type: 'client',
        firstName: 'Steve',
        lastName: 'Jobs',
        balance: 100,
        profession: 'driver',
      })

      await Profile.create({
        id: 21,
        type: 'client',
        firstName: 'Steve',
        lastName: 'Jobs',
        balance: 100,
        profession: 'driver',
      })

      await Profile.create({
        id: 22,
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
        ContractorId: 11,
        ClientId: 21,
        status: 'in_progress',
        terms: 'contract terms',
      })

      await Contract.create({
        id: 103,
        ContractorId: 12,
        ClientId: 22,
        status: 'in_progress',
        terms: 'contract terms',
      })

      await Contract.create({
        id: 104,
        ContractorId: 10,
        ClientId: 22,
        status: 'in_progress',
        terms: 'contract terms',
      })

      // create jobs
      await Job.create({
        id: 1001,
        ContractId: 101,
        paid: true,
        paymentDate: new Date('2020-01-01'),
        description: 'job description',
        price: 100,
      })

      await Job.create({
        id: 1002,
        ContractId: 102,
        paid: true,
        paymentDate: new Date('2020-01-02'),
        description: 'job description',
        price: 100,
      })

      await Job.create({
        id: 1003,
        ContractId: 103,
        paid: true,
        paymentDate: new Date('2020-01-03'),
        description: 'job description',
        price: 100,
      })

      // Job outside of the period
      await Job.create({
        id: 1004,
        ContractId: 104,
        paid: true,
        paymentDate: new Date('2020-01-06'),
        description: 'job description',
        price: 700,
      })

      const response = await request(server).get(
        '/admin/best-profession?start=2020-01-01&end=2020-01-05',
      )

      expect(response.status).toEqual(200)
      expect(response.body).toEqual('cook')
    })
  })

  describe('GET /admin/best-clients?start=<date>&end=<date>&limit=<integer>', () => {
    it('should return the best clients in the given period', async () => {
      // create profiles (contractor)
      await Profile.create({
        id: 10,
        type: 'contractor',
        firstName: 'John',
        lastName: 'Doe',
        profession: 'plumber',
      })

      await Profile.create({
        id: 11,
        type: 'contractor',
        firstName: 'John',
        lastName: 'Doe',
        profession: 'cook',
      })

      await Profile.create({
        id: 12,
        type: 'contractor',
        firstName: 'John',
        lastName: 'Doe',
        profession: 'cook',
      })

      // create profiles (client)
      await Profile.create({
        id: 20,
        type: 'client',
        firstName: 'Steve',
        lastName: 'Jobs',
        balance: 100,
        profession: 'driver',
      })

      await Profile.create({
        id: 21,
        type: 'client',
        firstName: 'Steve',
        lastName: 'Wozniak',
        balance: 100,
        profession: 'driver',
      })

      await Profile.create({
        id: 22,
        type: 'client',
        firstName: 'John',
        lastName: 'Cena',
        balance: 100,
        profession: 'wrestler',
      })

      // create contracts
      await Contract.create({
        id: 101,
        ContractorId: 10,
        ClientId: 20,
        status: 'in_progress',
        terms: 'contract terms',
      })

      // Same client paid twice
      await Contract.create({
        id: 102,
        ContractorId: 11,
        ClientId: 21,
        status: 'in_progress',
        terms: 'contract terms',
      })
      await Contract.create({
        id: 103,
        ContractorId: 12,
        ClientId: 21,
        status: 'in_progress',
        terms: 'contract terms',
      })

      await Contract.create({
        id: 104,
        ContractorId: 12,
        ClientId: 22,
        status: 'in_progress',
        terms: 'contract terms',
      })

      await Contract.create({
        id: 105,
        ContractorId: 12,
        ClientId: 22,
        status: 'in_progress',
        terms: 'contract terms',
      })

      // create jobs
      await Job.create({
        id: 1001,
        ContractId: 101,
        paid: true,
        paymentDate: new Date('2020-01-01'),
        description: 'job description',
        price: 100,
      })

      await Job.create({
        id: 1002,
        ContractId: 102,
        paid: true,
        paymentDate: new Date('2020-01-02'),
        description: 'job description',
        price: 80,
      })

      await Job.create({
        id: 1003,
        ContractId: 103,
        paid: true,
        paymentDate: new Date('2020-01-03'),
        description: 'job description',
        price: 70,
      })

      await Job.create({
        id: 1004,
        ContractId: 104,
        paid: true,
        paymentDate: new Date('2020-01-04'),
        description: 'job description',
        price: 120,
      })

      // Job out of period
      await Job.create({
        id: 1005,
        ContractId: 105,
        paid: true,
        paymentDate: new Date('2020-01-06'),
        description: 'job description',
        price: 700,
      })

      const response = await request(server).get(
        '/admin/best-clients?start=2020-01-01&end=2020-01-05&limit=2',
      )

      expect(response.status).toEqual(200)
      expect(response.body).toEqual([
        {
          id: 21,
          fullName: 'Steve Wozniak',
          paid: 150,
        },
        {
          id: 22,
          fullName: 'John Cena',
          paid: 120,
        },
      ])
    })
  })
})
