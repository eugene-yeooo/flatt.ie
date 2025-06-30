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
      'payment.flatmate_id as flattieId',
      'bill.title as billTitle',
      'bill.total_amount as billTotal',
      'bill.due_date as dueDate',
      'flattie.name as flattieName',
      'flattie.profile_photo as profilePhoto',
    )
}

export async function updatePaymentStatus(id: number, paid: boolean) {
  return connection('payment').where({ id }).update({ paid })
}

export async function payFromCredit(paymentId: number) {
  return connection.transaction(async (trx) => {
    const payment = await trx('payment').where({ id: paymentId }).first()
    if (!payment || payment.paid) throw new Error('Invalid payment')

    const flattie = await trx('flattie').where({ id: payment.flatmate_id }).first()
    if (!flattie || flattie.credit < payment.amount) throw new Error('Insufficient credit')

    await trx('flattie').where({ id: payment.flatmate_id }).update({ credit: flattie.credit - payment.amount })
    await trx('payment').where({ id: paymentId }).update({ paid: true })
    return { success: true }
  })
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
      'payment.amount',
      'bill.title as billTitle',
      'bill.due_date as dueDate',
      'bill.total_amount as billTotal',
      'flattie.name as flattieName',
      'flattie.profile_photo as profilePhoto',
    )
    .where('payment.bill_id', billId)

  console.log(paymentsToInsert)
  return payments
}

export async function deletePaymentById(id: number) {
  return connection('payment').where({ id }).del()
}
