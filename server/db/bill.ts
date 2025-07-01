import { NewBill, Share, UpdateBillData } from 'models/models.ts'
import connection from './connection.ts'

// ----------- GET BILLS ------------- //

export async function getAllBills() {
  return connection('bill')
    .leftJoin('expense', 'bill.expense_category', 'expense.category')
    .leftJoin('payment', 'bill.id', 'payment.bill_id')
    .leftJoin('users', 'payment.user_id', 'users.id')
    .select(
      'bill.id',
      'bill.title',
      'bill.due_date as dueDate',
      'bill.total_amount as totalAmount',
      'expense.category as expenseCategory',
      'expense.frequency',
      'payment.id as paymentId',
      'payment.amount as paymentAmount',
      'payment.split',
      'payment.paid',
      'payment.user_id as userId',
      'users.name as userName',
    )
}

export async function getBillById(id: number) {
  const rows = await connection('bill')
    .where('bill.id', id)
    .leftJoin('expense', 'bill.expense_category', 'expense.category')
    .leftJoin('payment', 'bill.id', 'payment.bill_id')
    .leftJoin('users', 'payment.user_id', 'users.id')
    .select(
      'bill.id as billId',
      'bill.title',
      'bill.due_date as dueDate',
      'bill.total_amount as totalAmount',
      'expense.category as expenseCategory',
      'expense.frequency',
      'payment.id as paymentId',
      'payment.amount as paymentAmount',
      'payment.split',
      'payment.paid',
      'payment.user_id as usersId',
      'users.name as usersName',
    )

  const { billId, title, dueDate, totalAmount, expenseCategory, frequency } =
    rows[0]

  const payments = rows
    .filter((row) => row.paymentId !== null) // handle bills with no payments yet
    .map((row) => ({
      paymentId: row.paymentId,
      amount: row.paymentAmount,
      split: row.split,
      paid: row.paid,
      userId: row.usersId,
      userName: row.usersName,
    }))

  return {
    id: billId,
    title,
    dueDate,
    totalAmount,
    expenseCategory,
    frequency,
    payments,
  }
}

// ----------- ADD NEW BILL ------------- //

export async function addBill(data: NewBill) {
  const [id] = await connection('bill').insert(data)
  return id
}

// ----------- DELETE BILL ------------- //

export function deleteBill(id: number) {
  return connection('bill').where({ id }).delete()
}

// ----------- UPDATE BILL ------------- //

export async function updateBillAndPayments(
  billId: number,
  billData: UpdateBillData,
  shares: Share[],
) {
  await connection('bill').where({ id: billId }).update(billData)

  const existingPayments = await connection('payment').where('bill_id', billId)

  const incomingIds = shares.map((s) => String(s.flatmateId))

  // 1. Delete payments for flatmates no longer in the list
  const toDelete = existingPayments.filter(
    (p) => !incomingIds.includes(String(p.flatmateId)),
  )
  await connection('payment')
    .whereIn(
      'id',
      toDelete.map((p) => p.id),
    )
    .del()

  // 2. Upsert each incoming share
  for (const share of shares) {
    const match = existingPayments.find(
      (p) => String(p.flatmateId) === String(share.flatmateId),
    )
    if (match) {
      // update
      await connection('payment')
        .where({ id: match.id })
        .update({
          amount: Number(share.amount),
          split: Number(share.split),
          paid: share.paid,
        })
    } else {
      // insert
      await connection('payment').insert({
        bill_id: billId,
        flatmate_id: share.flatmateId,
        amount: Number(share.amount),
        split: Number(share.split),
        paid: share.paid,
      })
    }
  }
}

// export function updateBill(data: UpdateBillData) {
//   const { id, ...fieldsToUpdate } = data
//   return connection('bill').where({ id }).update(fieldsToUpdate)
// }

export async function getBillCount() {
  const result = await connection('bill').count('id as count')
  return result[0].count
}
