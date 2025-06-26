import knex from './connection'
import connection from './connection'

interface Flatmate {
  name: string
  credit: number
  debt: number
}

export async function getAllFlatmates() {
  return knex('flattie').select('id', 'name', 'credit', 'debt')
}

export async function addFlatmate(flatmate: Flatmate) {
  return knex('flattie').insert(flatmate).returning('*')
}

export function deleteFlatmate(id: number, db = connection) {
  return db('flattie').where({ id }).del()
}