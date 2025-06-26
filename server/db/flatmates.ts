import connection from './connection'

interface Flatmate {
  name: string
  credit: number
  debt: number
}

// Get all flatmates
export async function getAllFlatmates() {
  return connection('flatmate').select('id', 'name', 'credit', 'debt')
}

// Add a new flatmate
export async function addFlatmate(flatmate: Flatmate) {
  return connection('flatmate').insert(flatmate).returning('*')
}

// Delete a flatmate
export function deleteFlatmate(id: number, db = connection) {
  return db('flatmate').where({ id }).del()
}
