import { NewBill, UpdateBillData } from 'models/models.ts'
import connection from './connection.ts'

// ----------- GET BILLS ------------- //

export async function getAllBills() {
  return connection('bill')
    .leftJoin('expense', 'bill.expense_category', 'expense.category')
    .leftJoin('payment', 'bill.id', 'payment.bill_id')
    .leftJoin('users', 'payment.flatmate_id', 'users.id')
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
      'payment.flatmate_id as usersId',
      'users.name as usersName',
    )
}

export async function getBillById(id: number) {
  const rows = await connection('bill')
    .where('bill.id', id)
    .leftJoin('expense', 'bill.expense_category', 'expense.category')
    .leftJoin('payment', 'bill.id', 'payment.bill_id')
    .leftJoin('users', 'payment.flatmate_id', 'users.id')
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
      'payment.flatmate_id as usersId',
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
      flatmateId: row.usersId,
      flatmateName: row.usersName,
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

export function updateBill(data: UpdateBillData) {
  const { id, ...fieldsToUpdate } = data
  return connection('bill').where({ id }).update(fieldsToUpdate)
}

export async function getBillCount() {
  const result = await connection('bill').count('id as count')
  return result[0].count
}
