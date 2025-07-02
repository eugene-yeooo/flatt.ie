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
  start_date: string | Date
  end_date: string | Date
  default_amount: number | null
  calc_method: 'split' | 'manual'
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
  userId: number
  userName: string
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
  start_date: string | Date
  end_date: string | Date
  default_amount: number | null
  calc_method: 'split' | 'manual'
  notes?: string
}

export interface Payment {
  id: number
  billId: number
  userId: number
  amount: number
  split: number
  paid: boolean
  billTitle: string
  billTotal: number
  dueDate: string | Date
  userName: string
  profilePhoto?: string
}

export interface UpdateBillData {
  id: number
  title: string
  dueDate: string | Date
  totalAmount: number
  expenseCategory?: string
}

// ------- User -------
export interface User {
  user_id: number
  id: number
  auth0_id: string
  username: string
  name: string
  email: string
  avatar_url?: string
  account_type: 'flat_financer' | 'flattie' | 'guest'
  credit: number
  bio?: string
  created_at?: string
  updated_at?: string
}

export interface Flat {
  id: number
  name: string
  address?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Share {
  userId: number
  amount: number
  split: number
  paid: boolean
}

export interface UpdateBillRequest {
  bill: UpdateBillData
  shares: Share[]
}
