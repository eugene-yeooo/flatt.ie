// import connection from './connection'
// import { Flatmate } from 'models/models'

// interface FlatmateDBRow {
//   id: number
//   name: string
//   credit: number
//   profilePhoto?: string
//   unpaidAmount: string | number | null
//   overdueAmount?: string | number | null
// }

// // Get all flatmates
// export async function getAllFlatmates() {
//   return connection('flattie').select(
//     'id',
//     'name',
//     'credit',
//     'profile_photo as profilePhoto',
//   )
// }

// // Add a new flatmate
// export async function addFlatmate(flatmate:Omit<Flatmate, 'id' | 'balance' | 'unpaid' | 'overdue'>) {
//   const flatmateToInsert = {
//     name: flatmate.name,
//     credit: flatmate.credit,
//     profile_photo: flatmate.profilePhoto,
//   }
//   return connection('flattie').insert(flatmateToInsert).returning('*')
// }

// // Delete a flatmate
// export function deleteFlatmate(id: number, db = connection) {
//   return db('flattie').where({ id }).del()
// }

// // Get flatmates with unpaid & overdue info (adjusted by credit)
// export async function getFlatmatesWithData() {
//   const today = new Date().toISOString()
//   const flatmates: FlatmateDBRow[] = await connection('flattie')
//   .leftJoin('payment', 'flattie.id', 'payment.flatmate_id')
//   .leftJoin('bill', 'payment.bill_id', 'bill.id')
//   .select([
//     'flattie.id', 'flattie.name', 'flattie.credit', 'flattie.profile_photo as profilePhoto',
//     connection.raw(`COALESCE(SUM(CASE WHEN payment.paid = false THEN payment.amount ELSE 0 END), 0) AS unpaidAmount`),
//     connection.raw(`COALESCE(SUM(CASE WHEN payment.paid = false AND bill.due_date < ? THEN payment.amount ELSE 0 END), 0) AS overdueAmount`, [today])
//   ])
//   .groupBy('flattie.id', 'flattie.name', 'flattie.credit', 'flattie.profile_photo')

//   return flatmates.map((f) => {
//     const credit = Number(f.credit) || 0
//     const unpaid = Number(f.unpaidAmount) || 0
//     const overdue = Number(f.overdueAmount) || 0

//     const balance = credit - overdue

//     return {
//     id: f.id,
//     name: f.name,
//     credit,
//     profilePhoto: f.profilePhoto,
//     unpaid,
//     overdue: unpaid,
//     balance,
//   }})
// }
