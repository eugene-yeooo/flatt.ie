import connection from './connection'
import { Flatmate } from 'models/models'

// Get all flatmates
export async function getAllFlatmates() {
  return connection('flattie').select(
    'id',
    'name',
    'credit',
    'debt',
    'profile_photo as profilePhoto',
  )
}

// Add a new flatmate
export async function addFlatmate(flatmate: Flatmate) {
  return connection('flattie').insert(flatmate).returning('*')
}

// Delete a flatmate
export function deleteFlatmate(id: number, db = connection) {
  return db('flattie').where({ id }).del()
}
