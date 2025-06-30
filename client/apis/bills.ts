import request from 'superagent'
import {
  Bill,
  NewBill,
  UpdateBillData,
  UpdateBillRequest,
} from '../../models/models'

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
  try {
    const res = await request.get(`${billURL}/${id}`)
    return res.body as Bill
  } catch (err) {
    console.error('Failed to fetch bill:', err)
    throw err
  }
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

// ---------- UPDATE BILL ---------- //

export async function updateBill(data: UpdateBillRequest) {
  try {
    const res = await request
      .patch(`${billURL}/update-bill/${data.bill.id}`)
      .send(data)
    return res.body
  } catch (err) {
    console.error('Failed to update bill', err)
    throw err
  }
}
