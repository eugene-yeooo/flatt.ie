import knex from './connection'

export async function getAllFlatmates() {
  return knex('flattie').select('id', 'name', 'credit', 'debt')
}