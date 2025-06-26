import { Expense } from 'models/models.ts'
import connection from './connection.ts'

export async function getAllExpenses() {
  return connection('expense').select(
    'id',
    'category',
    'frequency',
    'default_amount',
    'calc_method',
    'notes',
  )
}

export async function addExpense(data: Expense) {
  const [id] = await connection('expense').insert({
    category: data.type,
    frequency: data.frequency,
    defaultAmount: data.defaultAmount,
    calcMethod: data.calcMethod,
    notes: data.notes,
  })
  return id
}
