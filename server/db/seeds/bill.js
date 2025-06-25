/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('bill').del()

  // Inserts seed entries
  await knex('bill').insert([
    {
      id: 1,
      title: 'Week of 2 June Rent',
      expense_id: '1',
      due_date: '2025-06-02',
      total_amount: 620.0,
    },
    {
      id: 2,
      title: 'Week of 9 June Rent',
      expense_id: '1',
      due_date: '2025-06-09',
      total_amount: 620.0,
    },
    {
      id: 3,
      title: 'Week of 16 June Rent',
      expense_id: '1',
      due_date: '2025-06-16',
      total_amount: 620.0,
    },
    {
      id: 4,
      title: 'May 2025 Power Bill',
      expense_id: '2',
      due_date: '2025-05-31',
      total_amount: 158.75,
    },

    {
      id: 5,
      title: 'May 2025 Internet',
      expense_id: '3',
      due_date: '2025-05-31',
      total_amount: 85.0,
    },

    {
      id: 6,
      title: 'May 2025 Rubbish',
      expense_id: '4',
      due_date: '2025-05-31',
      total_amount: 65.6,
    },

    {
      id: 7,
      title: 'Week of 23 June Rent',
      expense_id: '1',
      due_date: '2025-06-23',
      total_amount: 620.0,
    },
    {
      id: 8,
      title: 'Week of 30 June Rent',
      expense_id: '1',
      due_date: '2025-06-30',
      total_amount: 620.0,
    },

    {
      id: 9,
      title: 'June 2025 Power Bill',
      expense_id: '2',
      due_date: '2025-06-30',
      total_amount: 163.24,
    },

    {
      id: 10,
      title: 'June 2025 Internet',
      expense_id: '3',
      due_date: '2025-06-30',
      total_amount: 85.0,
    },

    {
      id: 11,
      title: 'June 2025 Rubbish',
      expense_id: '4',
      due_date: '2025-06-30',
      total_amount: 65.6,
    },
  ])
}
