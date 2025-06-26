import connection from './connection.ts'

export async function getAllFlatties() {
  return connection('flattie').select('*')
}
