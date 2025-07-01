import { NewBill, Share, UpdateBillData } from 'models/models.ts'
import connection from './connection.ts'

// ----------- GET ALL BILLS ------------- //

export async function getAllBills() {
  return connection('bill')
    .leftJoin('expense', 'bill.expense_category', 'expense.category') // fixed typo 'expense_ategory'
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

// ----------- GET BILL BY ID ------------- //

export async function getBillById(id: number) {
  const rows = await connection('bill')
    .where('bill.id', id)
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

  if (!rows.length) return null

  const {
    id: billId,
    title,
    dueDate,
    totalAmount,
    expenseCategory,
    frequency,
  } = rows[0]

  const payments = rows
    .filter((row) => row.paymentId !== null)
    .map((row) => ({
      paymentId: row.paymentId,
      amount: row.paymentAmount,
      split: row.split,
      paid: row.paid,
      userId: row.userId,
      userName: row.userName,
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

// ----------- ADD BILL ------------- //

export async function addBill(data: NewBill) {
  const [id] = await connection('bill').insert(data)
  return id
}

// ----------- DELETE BILL ------------- //

export function deleteBill(id: number) {
  return connection('bill').where({ id }).delete()
}

// ----------- UPDATE BILL AND PAYMENTS ------------- //
function formatDate(date: string | Date): string {
  if (typeof date === 'string') return date
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function updateBillAndPayments(
  billId: number,
  billData: UpdateBillData,
  shares: Share[],
) {
  await connection('bill')
    .where({ id: billId })
    .update({
      title: billData.title,
      due_date:
        typeof billData.dueDate === 'string'
          ? billData.dueDate
          : formatDate(billData.dueDate),
      total_amount: billData.totalAmount,
      expense_category: billData.expenseCategory,
    })

  const existingPayments = await connection('payment').where('bill_id', billId)

  const incomingIds = shares.map((s) => String(s.userId))

  // 1. Delete payments for users no longer in the list
  const toDelete = existingPayments.filter(
    (p) => !incomingIds.includes(String(p.user_id)),
  )

  if (toDelete.length > 0) {
    await connection('payment')
      .whereIn(
        'id',
        toDelete.map((p) => p.id),
      )
      .del()
  }

  // 2. Upsert each incoming share
  for (const share of shares) {
    const match = existingPayments.find(
      (p) => String(p.user_id) === String(share.userId),
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
        user_id: share.userId,
        amount: Number(share.amount),
        split: Number(share.split),
        paid: share.paid,
      })
    }
  }
}

// ----------- COUNT BILLS ------------- //

export async function getBillCount() {
  const result = await connection('bill').count('id as count')
  return result[0].count
}
