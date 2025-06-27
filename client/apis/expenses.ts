import request from 'superagent'
import { Expense, NewExpense } from '../../models/models'

const expensesURL = '/api/v1/expense'

export async function getAllExpenses(): Promise<Expense[]> {
  const res = await request.get(expensesURL)
  return res.body
}

export async function getExpensesById(id: number | string): Promise<Expense> {
  const res = await request.get(`${expensesURL}/${id}`)
  return res.body
}

export async function addExpense(data: NewExpense) {
  try {
    const res = await request.post(`${expensesURL}/`).send(data)
    return res.body.id
  } catch (err) {
    console.error('Failed to add Expense type', err)
    throw err
  }
}
