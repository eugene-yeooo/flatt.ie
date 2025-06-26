import { NewBill } from 'models/models.ts'
import connection from './connection.ts'

export async function getAllBills() {
  return connection('bill')
    .join('expense', 'bill.expense_category', 'expense.id')
    .join('payment', 'bill.id', 'payment.bill_id')
    .select(
      'bill.id as billId',
      'bill.title',
      'bill.due_date',
      'bill.total_amount',
      'expense.category as expenseCategory',
      'expense.frequency',
      'payment.id as paymentId',
      'payment.amount as paymentAmount',
      'payment.split',
      'payment.paid',
      'payment.flatmate_id',
    )
}

// ----------- ADD NEW BILL ------------- //

// Utility function to map category - uses a typescript object (Records) that acts as a lookup table
export function getExpenseId(name: string): number | null {
  const expenseCategoryMap: Record<string, number> = {
    Rent: 1,
    Internet: 2,
    Power: 3,
    Rubbish: 4,
  }
  return expenseCategoryMap[name] ?? null
}

export async function addBill(data: NewBill) {
  const expenseId = getExpenseId(data.expense_category)
  const [id] = await connection('bill').insert({
    title: data.title,
    due_date: data.due_date,
    total_amount: data.total_amount,
    expense_id: expenseId,
  })
  return id
}
