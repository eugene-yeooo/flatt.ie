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
    category: data.category,
    frequency: data.frequency,
    default_amount: data.default_amount,
    calc_method: data.calc_method,
    notes: data.notes,
  })
  return id
}
