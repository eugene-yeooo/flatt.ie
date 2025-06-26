import connection from './connection.ts'

export async function getAllBills() {
  return connection('bill').select('*')
}
