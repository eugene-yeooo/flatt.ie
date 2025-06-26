import request from 'superagent'
import { Expense } from '../../models/models'

const expensesURL = '/api/v1/expense'

export async function getAllExpenses(): Promise<Expense[]> {
  const res = await request.get(expensesURL)
  return res.body
}

export async function getExpensesById(id: number | string): Promise<Expense> {
  const res = await request.get(`${expensesURL}/${id}`)
  return res.body
}
