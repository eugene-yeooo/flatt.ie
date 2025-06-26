import connection from './connection'

interface Flatmate {
  name: string
  credit: number
  debt: number
}

// Get all flatmates
export async function getAllFlatmates() {
  return connection('flattie').select('*')
}

// Add a new flatmate
export async function addFlatmate(flatmate: Flatmate) {
  return connection('flattie').insert(flatmate).returning('*')
}

// Delete a flatmate
export function deleteFlatmate(id: number, db = connection) {
  return db('flattie').where({ id }).del()
}
