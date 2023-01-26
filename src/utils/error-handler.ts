import { ErrorRequestHandler } from 'express'
import stringify from 'fast-safe-stringify'

export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  const statusCode = err.statusCode || err.status || 500
  let message = err.message
  if (!message) {
    if (err instanceof Error) {
      message = err.toString()
    } else {
      message = stringify(err)
    }
  }
  res.status(statusCode).json({ error: message })
}
