import request from 'superagent'
import { Payment } from '../../models/models'

const paymentURL = '/api/v1/payment'

export async function getAllPayments(): Promise<Payment[]> {
  const res = await request.get(paymentURL)
  return res.body
}
