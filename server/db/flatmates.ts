import connection from './connection'
import { Flatmate } from 'models/models'

interface FlatmateDBRow {
  id: number
  name: string
  credit: number
  debt: number
  profilePhoto?: string
  unpaidAmount: string | number | null
}

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
export async function addFlatmate(flatmate:Omit<Flatmate, 'id' | 'balance' | 'unpaid'>) {
  return connection('flattie').insert(flatmate).returning('*')
}

// Delete a flatmate
export function deleteFlatmate(id: number, db = connection) {
  return db('flattie').where({ id }).del()
}

export async function getFlatmatesWithBalance() {
  const flatmates: FlatmateDBRow[] = await connection('flattie')
  .leftJoin('payment', 'flattie.id', 'payment.flatmate_id')
  .select(
    'flattie.id', 'flattie.name', 'flattie.credit', 'flattie.debt', 'flattie.profile_photo as profilePhoto'
  )
  .sum({ unpaidAmount: connection.raw(`CASE WHEN payment.paid = false THEN payment.amount ELSE 0 END`) })
  .groupBy('flattie.id')

  return flatmates.map((f: FlatmateDBRow) => ({
    id: f.id,
    name: f.name,
    credit: f.credit,
    debt: f.debt,
    profilePhoto: f.profilePhoto,
    balance: f.credit - f.debt,
    unpaid: Number(f.unpaidAmount) || 0,
  }))
}
