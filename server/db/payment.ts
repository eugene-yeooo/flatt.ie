import connection from './connection.ts'

export async function getAllPayments() {
  return connection('payment').select('*')
}
