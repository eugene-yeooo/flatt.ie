import request from 'superagent'
import { Expense, NewExpense } from '../../models/models'

const expensesURL = '/api/v1/expense'

// ---------- GET ALL EXPENSE ---------- //

export async function getAllExpenses(): Promise<Expense[]> {
  const res = await request.get(expensesURL)
  return res.body
}

// ---------- GET SINGLE EXPENSE ---------- //

export async function getExpensesById(id: number | string): Promise<Expense> {
  const res = await request.get(`${expensesURL}/${id}`)
  return res.body
}

// ---------- ADD EXPENSE ---------- //

export async function addExpense(data: NewExpense) {
  try {
    const res = await request.post(`${expensesURL}/`).send(data)
    return res.body.id
  } catch (err) {
    console.error('Failed to add Expense type', err)
    throw err
  }
}

// ---------- DELETE EXPENSE ---------- //

export async function deleteExpense(id: number) {
  try {
    const res = await request.delete(`${expensesURL}/${id}`)
    return res.body
  } catch (err) {
    console.error('Failed to delete expense', err)
    throw err
  }
}

// ---------- UPDATE Expense ---------- //

export async function updateExpense(data: Expense) {
  try {
    const res = await request.patch(`${expensesURL}/:id`).send(data)
    return res.body
  } catch (err) {
    console.error('Failed to update expense', err)
    throw err
  }
}
