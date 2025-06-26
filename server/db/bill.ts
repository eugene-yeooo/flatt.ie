import connection from './connection.ts'

export async function getAllBills() {
  return connection('bill')
    .leftJoin('expense', 'bill.expense_category', 'expense.id')
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
