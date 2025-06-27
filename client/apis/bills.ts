import request from 'superagent'
import { Bill, NewBill } from '../../models/models'

const billURL = '/api/v1/bill'

// ---------- GET BILLS ---------- //

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

// ---------- ADD BILL ---------- //

export async function addNewBill(data: NewBill) {
  try {
    const res = await request.post(`${billURL}/add-bill`).send(data)
    return res.body.id
  } catch (err) {
    console.error('Failed to add new bill', err)
    throw err
  }
}

// ---------- DELETE BILL ---------- //

export async function deleteBill(id: number) {
  try {
    const res = await request.delete(`${billURL}/delete-bill/${id}`)
    return res.body
  } catch (err) {
    console.error('Failed to delete bill', err)
    throw err
  }
}
