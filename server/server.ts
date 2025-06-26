import express from 'express'
import * as Path from 'node:path'

import flattiesRoutes from './routes/flatties.ts'
import expenseRoutes from './routes/expense.ts'
import billRoutes from './routes/bill.ts'

const server = express()

server.use(express.json())

server.use('/api/v1/flatties', flattiesRoutes)
server.use('/api/v1/expense', expenseRoutes)
server.use('/api/v1/bill', billRoutes)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
