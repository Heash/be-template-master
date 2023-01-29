import { Sequelize } from 'sequelize-typescript'
import { Contract } from './contract'
import { Profile } from './profile'
import { Job } from './job'

// Define database
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || 'db.sqlite',
  models: [Contract, Profile, Job],
})
