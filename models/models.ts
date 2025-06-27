export interface Flatmate {
  id: number
  name: string
  credit: number
  debt: number
  balance: number
  profilePhoto?: string
}

export interface Expense {
  id: number
  category: string
  frequency: 'weekly' | 'monthly' | 'one_off'
  default_amount: number | null
  calc_method: 'fixed_split' | 'manual' | 'percentage_split'
  notes?: string
}

export interface Bill {
  id: number
  title: string
  dueDate: string | Date
  totalAmount: number
  expenseCategory: string
  expenseFrequency: 'weekly' | 'monthly' | 'one_off'
  paymentId: number
  paymentAmount: number
  split: number
  paid: boolean
  flattieId: number
}

export interface NewBill {
  title: string
  due_date: string
  total_amount: number
  expense_category: string
}

export interface NewExpense {
  category: string
  frequency: 'weekly' | 'monthly' | 'one_off'
  default_amount: number | null
  calc_method: 'fixed_split' | 'manual' | 'percentage_split'
  notes?: string
}

export interface Payment {
  id: number
  billId: number
  flattieId: number
  amount: number
  split: number
  paid: boolean
  billTitle: string
  billTotal: number
  dueDate: string | Date
  flattieName: string
  profilePhoto?: string
}

export interface UpdateBillData {
  id: number
  title: string
  due_date: string | Date
  total_amount: number
  expense_category?: string
}
