import connection from './connection.ts'

export async function getAllPayments() {
  return connection('payment')
    .join('bill', 'payment.bill_id', 'bill.id')
    .join('flatmate', 'payment.flatmate_id', 'flatmate.id')
    .select(
      'payment.*',
      'bill.title as billTitle',
      'bill.due_date',
      'flatmate.name as flatmateName',
      'flatmate.profile_photo',
    )
}
