import request from 'superagent'
import { Bill, NewBill } from '../../models/models'

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

export async function getBillById(id: number | string): Promise<Bill> {
  const res = await request.get(`${billURL}/${id}`)
  return res.body
}

export async function addNewBill(data: NewBill) {
  try {
    const res = await request.post(`${billURL}/add-bill`).send(data)
    return res.body.id
  } catch (err) {
    console.error('Failed to add new bill', err)
    throw err
  }
}
