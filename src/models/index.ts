import { Sequelize } from 'sequelize-typescript'
import { Contract } from './contract'
import { Profile } from './profile'
import { Job } from './job'

// Define database
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3',
  models: [Contract, Profile, Job],
})
