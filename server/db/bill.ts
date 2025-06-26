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
