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
      default_amount: 620,
      calc_method: 'fixed_split',
      notes: '$155 x 4 people',
    },
    {
      id: 2,
      category: 'Power',
      frequency: 'monthly',
      default_amount: null,
      calc_method: 'manual',
      notes: 'Varies monthly',
    },
    {
      id: 3,
      category: 'Internet',
      frequency: 'monthly',
      default_amount: 85,
      calc_method: 'fixed_split',
      notes: '$21.25 x 4 people',
    },
    {
      id: 4,
      category: 'Rubbish',
      frequency: 'monthly',
      default_amount: 65.6,
      calc_method: 'fixed_split',
      notes: '$16.40 x 4 people',
    },
  ])
}
