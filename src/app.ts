import 'module-alias/register'
import * as dotenv from 'dotenv'
import express, { Express } from 'express'
import bodyParser from 'body-parser'
import { sequelize } from './model'
import { errorHandler } from '@utils/error-handler'
import { contractsRouter } from '@routers/contrasts'

dotenv.config()

// Middlewares
export const app: Express = express()
app.use(bodyParser.json())

// DB
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

// Controllers
app.use('/contracts', contractsRouter)

// Error Handler
app.use(errorHandler)
