/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('payment').del()
  await knex('payment').insert([
    // Payments for May 2025 Power Bill (bill_id: 4)
    {
      id: 5,
      user_id: 1,
      bill_id: 42,
      amount: 155,
      split: 0.25,
      paid: true,
    },
    {
      id: 6,
      user_id: 2,
      bill_id: 42,
      amount: 155,
      split: 0.25,
      paid: true,
    },
    {
      id: 7,
      user_id: 3,
      bill_id: 42,
      amount: 155,
      split: 0.25,
      paid: false,
    },
    {
      id: 8,
      user_id: 5,
      bill_id: 42,
      amount: 155,
      split: 0.25,
      paid: true,
    },

    { id: 9, user_id: 1, bill_id: 44, amount: 155, split: 0.25, paid: true },
    {
      id: 10,
      user_id: 2,
      bill_id: 44,
      amount: 155,
      split: 0.25,
      paid: true,
    },
    {
      id: 11,
      user_id: 3,
      bill_id: 44,
      amount: 155,
      split: 0.25,
      paid: false,
    },
    {
      id: 12,
      user_id: 5,
      bill_id: 44,
      amount: 155,
      split: 0.25,
      paid: true,
    },
  ])
}
