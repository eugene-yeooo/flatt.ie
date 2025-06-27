import { NewBill, UpdateBillData } from 'models/models.ts'
import connection from './connection.ts'

// ----------- GET BILLS ------------- //

export async function getAllBills() {
  return connection('bill')
    .leftJoin('expense', 'bill.expense_category', 'expense.category')
    .leftJoin('payment', 'bill.id', 'payment.bill_id')
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
      'payment.flatmate_id as flattieId',
    )
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
