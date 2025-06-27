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

// ------------ GENERATE PAYMENT FOR BILL ----------

export async function generatePayments(
  paymentsToInsert: any[],
  billId: number,
) {
  await connection('payment').insert(paymentsToInsert)

  const payments = await connection('payment')
    .join('bill', 'payment.bill_id', 'bill.id')
    .join('flattie', 'payment.flatmate_id', 'flattie.id')
    .select(
      'payment.id',
      'payment.split',
      'payment.paid',
      'bill.title as billTitle',
      'bill.due_date as dueDate',
      'bill.total_amount',
      'flattie.name as flattieName',
      'flattie.profile_photo as profilePhoto',
    )
    .where('payment.bill_id', billId)

  return payments.map((p) => ({
    ...p,
    amount: Number(p.total_amount) * Number(p.split),
    paid: Boolean(p.paid),
  }))
}
