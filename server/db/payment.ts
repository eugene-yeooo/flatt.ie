import connection from './connection.ts'

export async function getAllPayments() {
  return connection('payment')
    .join('bill', 'payment.bill_id', 'bill.id')
    .join('flattie', 'payment.flatmate_id', 'flattie.id')
    .select(
      'payment.id',
      'payment.amount',
      'payment.split',
      'payment.paid',
      'bill.title as billTitle',
      'bill.due_date as dueDate',
      'flattie.name as flattieName',
      'flattie.profile_photo as profilePhoto',
    )
}

export async function updatePaymentStatus(id: number, paid: boolean) {
  return connection('payment').where({ id }).update({ paid })
}
