import express from 'express'
import path, * as Path from 'node:path'
import userRoutes from './routes/userRoutes.ts'
import expenseRoutes from './routes/expense.ts'
import billRoutes from './routes/bill.ts'
import paymentRoutes from './routes/payment.ts'

const server = express()

server.use(express.json())
server.use('/uploads', express.static(path.resolve('server/public/uploads')))

server.use('/api/v1/expense', expenseRoutes)
server.use('/api/v1/bill', billRoutes)
server.use('/api/v1/payment', paymentRoutes)
server.use('/api/v1/users', userRoutes)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
