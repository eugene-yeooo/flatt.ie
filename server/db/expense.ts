import connection from './connection.ts'

export async function getAllExpenses() {
  return connection('expense').select(
    'id',
    'category',
    'frequency',
    'defaultAmount',
    'calcMethod',
    'notes',
  )
}
