import { app } from '@app/app'
import { sequelize } from '@app/models'
import { Server } from 'http'
import request from 'supertest'

let server: Server
const { Contract, Profile, Job } = sequelize.models

describe('Contracts', () => {
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

  describe('GET /contracts/:id', () => {
    it('should return the contract to the contractor', async () => {
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

      // create a contract
      await Contract.create({
        id: 101,
        ContractorId: 10,
        ClientId: 20,
        status: 'in_progress',
        terms: 'contract terms',
      })

      // create a job
      await Job.create({
        id: 201,
        price: 50,
        paid: false,
        description: 'job description',
      })

      // get the contract
      const response = await request(app)
        .get('/contracts/101')
        .set('profile_id', '10')

      expect(response.status).toBe(200)

      // check the response
      expect(response.body).toMatchObject({
        id: 101,
        ContractorId: 10,
        ClientId: 20,
        status: 'in_progress',
        terms: 'contract terms',
      })
    })

    it('should return the contract to the client', async () => {
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

      // create a contract
      await Contract.create({
        id: 101,
        ContractorId: 10,
        ClientId: 20,
        status: 'in_progress',
        terms: 'contract terms',
      })

      // create a job
      await Job.create({
        id: 201,
        price: 50,
        paid: false,
        description: 'job description',
      })

      // get the contract
      const response = await request(app)
        .get('/contracts/101')
        .set('profile_id', '20')

      expect(response.status).toBe(200)

      // check the response
      expect(response.body).toMatchObject({
        id: 101,
        ContractorId: 10,
        ClientId: 20,
        status: 'in_progress',
        terms: 'contract terms',
      })
    })

    it('should return 401 if profile_id is not provided', async () => {
      const response = await request(app).get('/contracts/101')
      expect(response.status).toBe(401)
    })

    it('should not return contract if profile_id is not the client or contractor', async () => {
      // create a profile (initiator client)
      await Profile.create({
        id: 30,
        type: 'contractor',
        firstName: 'John',
        lastName: 'Doe',
        profession: 'cook',
      })

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

      // create a contract
      await Contract.create({
        id: 101,
        ContractorId: 10,
        ClientId: 20,
        status: 'in_progress',
        terms: 'contract terms',
      })

      // create a job
      await Job.create({
        id: 201,
        price: 50,
        paid: false,
        description: 'job description',
      })

      // get the contract
      const response = await request(app)
        .get('/contracts/101')
        .set('profile_id', '30')

      expect(response.status).not.toBe(200)
    })
  })

  describe('GET /contracts/', () => {
    it('should return all the contracts that belong to the contractor', async () => {
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

      // create stranger profile
      await Profile.create({
        id: 30,
        type: 'client',
        firstName: 'Jane',
        lastName: 'Doe',
        balance: 100,
        profession: 'cook',
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

      // create a contract for the stranger
      await Contract.create({
        id: 103,
        ContractorId: 30,
        ClientId: 20,
        status: 'in_progress',
        terms: 'contract terms',
      })

      // create a job
      await Job.create({
        id: 201,
        price: 50,
        paid: false,
        description: 'job description',
      })

      // get the contract
      const response = await request(app)
        .get('/contracts/')
        .set('profile_id', '10')

      expect(response.status).toBe(200)

      // check the response
      expect(response.body).toHaveLength(2)
      expect(response.body).toMatchObject([
        {
          id: 101,
          ContractorId: 10,
          ClientId: 20,
          status: 'in_progress',
          terms: 'contract terms',
        },
        {
          id: 102,
          ContractorId: 10,
          ClientId: 20,
          status: 'in_progress',
          terms: 'contract terms',
        },
      ])

      expect(response.body).not.toMatchObject([
        {
          id: 103,
        },
      ])
    })

    it('should return all the contracts that belong to the client', async () => {
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

      // create stranger profile
      await Profile.create({
        id: 30,
        type: 'client',
        firstName: 'Jane',
        lastName: 'Doe',
        balance: 100,
        profession: 'cook',
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

      // create a contract for the stranger
      await Contract.create({
        id: 103,
        ContractorId: 10,
        ClientId: 30,
        status: 'in_progress',
        terms: 'contract terms',
      })

      // create a job
      await Job.create({
        id: 201,
        price: 50,
        paid: false,
        description: 'job description',
      })

      // get the contract
      const response = await request(app)
        .get('/contracts/')
        .set('profile_id', '20')

      expect(response.status).toBe(200)

      // check the response
      expect(response.body).toHaveLength(2)
      expect(response.body).toMatchObject([
        {
          id: 101,
          ContractorId: 10,
          ClientId: 20,
          status: 'in_progress',
          terms: 'contract terms',
        },
        {
          id: 102,
          ContractorId: 10,
          ClientId: 20,
          status: 'in_progress',
          terms: 'contract terms',
        },
      ])

      expect(response.body).not.toMatchObject([
        {
          id: 103,
        },
      ])
    })

    it('should return 401 if profile_id is not provided', async () => {
      const response = await request(app).get('/contracts/')
      expect(response.status).toBe(401)
    })
  })
})
