import connection from './connection.ts'

export async function getAllExpenses() {
  return connection('expense').select('*')
}
