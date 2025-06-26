export interface Flatmate {
  id: number
  name: string
  credit: number
  debt: number
  balance: number
  profile_photo?: string
}

export interface Expense {
  id: number
  type: string
  frequency: 'weekly' | 'monthly' | 'one_off'
  default_amount: number | null
  calc_method: 'fixed_split' | 'manual' | 'percentage_split'
  notes?: string
}

export interface Bill {
  billId: number
  title: string
  due_date: string | Date
  total_amount: number
  expenseCategory: string
  expenseFrequency: 'weekly' | 'monthly' | 'one_off'
  paymentId: number
  paymentAmount: number
  split: number
  paid: boolean
  flatmate_id: number
}

export interface NewBill {
  title: string
  due_date: string
  total_amount: number
  expense_category: string
}

export interface Payment {
  id: number
  bill_id: number
  flatmate_id: number
  amount: number
  split: number
  paid: boolean
  billTitle: string
  due_date: string | Date
  flattieName: string
  profile_photo?: string
}
