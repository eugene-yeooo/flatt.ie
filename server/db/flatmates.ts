import knex from './connection'

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