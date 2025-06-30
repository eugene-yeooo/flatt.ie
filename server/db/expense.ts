import { Expense } from 'models/models.ts'
import connection from './connection.ts'

export async function getAllExpenses() {
  return connection('expense').select(
    'id',
    'category',
    'frequency',
    'start_date',
    'end_date',
    'default_amount',
    'calc_method',
    'notes',
  )
}

export async function addExpense(data: Expense) {
  const [id] = await connection('expense').insert({
    category: data.category,
    frequency: data.frequency,
    start_date: data.start_date,
    end_date: data.end_date,
    default_amount: data.default_amount,
    calc_method: data.calc_method,
    notes: data.notes,
  })
  return id
}

// ----------- DELETE EXPENSE ------------- //

export function deleteExpense(id: number) {
  return connection('expense').where({ id }).delete()
}
