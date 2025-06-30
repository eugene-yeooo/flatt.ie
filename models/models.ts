export interface Flatmate {
  id: number
  name: string
  credit: number
  debt?: number
  balance: number
  profilePhoto?: string
}

export interface FlatmateWithData extends Flatmate {
  overdue: number
  unpaid: number
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
  paid: number
  flattieId: number
  flattieName: string
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

// ------- AUTH0 -------
export interface User {
  id: number
  auth0_id: string
  username: string
  email: string
  avatar_url?: string
}

// profiles

export type AccountType = 'finance_manager' | 'flattie' | 'guest'

export interface Profile {
  id: number
  user_id: number
  profile_name: string
  account_type: AccountType
  active: boolean
  created_at: string
  updated_at: string
  // Profile photo
}

export interface Flat {
  id: number
  name: string
  address?: string
  description?: string
  created_at: string
  updated_at: string
}
