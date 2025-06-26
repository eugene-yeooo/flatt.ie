import request from 'superagent'
import { Bill } from '../../models/models'

const billURL = '/api/v1/bill'

export async function getAllBills(): Promise<Bill[]> {
  try {
    const res = await request.get(billURL)
    return res.body
  } catch (err) {
    console.error('Failed to fetch bills:', err)
    throw err
  }
}

export async function getExpensesById(id: number | string): Promise<Bill> {
  const res = await request.get(`${billURL}/${id}`)
  return res.body
}
