import 'module-alias/register'
import * as dotenv from 'dotenv'
import express, { Express } from 'express'
import bodyParser from 'body-parser'
import { sequelize } from './models'
import { errorHandler } from '@utils/error-handler'
import { contractsRouter } from '@routers/contrasts'
import { jobsRouter } from './routers/jobs'
import { balancesRouter } from './routers/balances'
import { adminRouter } from './routers/admin'

dotenv.config()

// Middlewares
export const app: Express = express()
app.use(bodyParser.json())

// DB
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

// Controllers
app.use('/contracts', contractsRouter)
app.use('/jobs', jobsRouter)
app.use('/balances', balancesRouter)
app.use('/admin', adminRouter)

// Error Handler
app.use(errorHandler)
