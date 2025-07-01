import connection from './connection.ts'

export async function getAllPayments() {
  return connection('payment')
    .join('bill', 'payment.bill_id', 'bill.id')
    .join('users', 'payment.user_id', 'users.id')
    .select(
      'payment.id',
      'payment.amount',
      'payment.split',
      'payment.paid',
      'payment.user_id as userId',
      'bill.title as billTitle',
      'bill.total_amount as billTotal',
      'bill.due_date as dueDate',
      'users.name as userName',
      'users.avatar_url',
    )
}

export async function updatePaymentStatus(id: number, paid: boolean) {
  return connection('payment').where({ id }).update({ paid })
}

export async function payFromCredit(paymentId: number) {
  return connection.transaction(async (trx) => {
    const payment = await trx('payment').where({ id: paymentId }).first()
    if (!payment || payment.paid) throw new Error('Invalid payment')

    const user = await trx('users').where({ id: payment.user_id }).first()
    if (!user || user.credit < payment.amount)
      throw new Error('Insufficient credit')

    await trx('users')
      .where({ id: payment.user_id })
      .update({ credit: user.credit - payment.amount })
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
    .join('users', 'payment.user_id', 'users.id')
    .select(
      'payment.id',
      'payment.split',
      'payment.paid',
      'payment.amount',
      'bill.title as billTitle',
      'bill.due_date as dueDate',
      'bill.total_amount as billTotal',
      'users.name as usersName',
      'users.profile_photo as profilePhoto',
    )
    .where('payment.bill_id', billId)

  console.log(paymentsToInsert)
  return payments
}

export async function deletePaymentById(id: number) {
  return connection('payment').where({ id }).del()
}
