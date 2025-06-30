/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('expense').del()
  await knex('expense').insert([
    {
      id: 1,
      category: 'Rent',
      frequency: 'weekly',
      start_date: '2025-02-10',
      end_date: '2025-07-30',
      default_amount: 620,
      calc_method: 'split',
      notes: '$155 x 4 people',
    },
    {
      id: 2,
      category: 'Power',
      frequency: 'monthly',
      start_date: '2025-04-30',
      end_date: '2025-05-20',
      default_amount: null,
      calc_method: 'manual',
      notes: 'Varies monthly',
    },
    {
      id: 3,
      category: 'Internet',
      frequency: 'monthly',
      start_date: '2025-04-30',
      end_date: '2025-06-30',
      default_amount: 85,
      calc_method: 'split',
      notes: '$21.25 x 4 people',
    },
    {
      id: 4,
      category: 'Rubbish',
      frequency: 'monthly',
      start_date: '2025-05-30',
      end_date: '2025-08-10',
      default_amount: 65.6,
      calc_method: 'split',
      notes: '$16.40 x 4 people',
    },
  ])
}
