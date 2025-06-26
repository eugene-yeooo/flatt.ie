import connection from './connection.ts'

export async function getAllPayments() {
  return connection('payment')
    .join('bill', 'payment.bill_id', 'bill.id')
    .join('flattie', 'payment.flatmate_id', 'flattie.id')
    .select(
      'payment.*',
      'bill.title as billTitle',
      'bill.due_date',
      'flattie.name as flattieName',
      'flattie.profile_photo',
    )
}
