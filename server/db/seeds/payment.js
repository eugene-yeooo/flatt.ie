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
      flatmate_id: 1,
      bill_id: 4,
      amount: 39.69,
      split: 0.2425,
      paid: true,
    },
    {
      id: 6,
      flatmate_id: 2,
      bill_id: 4,
      amount: 39.69,
      split: 0.2425,
      paid: true,
    },
    {
      id: 7,
      flatmate_id: 3,
      bill_id: 4,
      amount: 39.69,
      split: 0.2425,
      paid: false,
    },
    {
      id: 8,
      flatmate_id: 4,
      bill_id: 4,
      amount: 44.17,
      split: 0.2725,
      paid: true,
    },

    // Payments for June 2025 Internet (bill_id: 10)
    { id: 9, flatmate_id: 1, bill_id: 10, amount: 21.25, split: 1, paid: true },
    {
      id: 10,
      flatmate_id: 2,
      bill_id: 10,
      amount: 21.25,
      split: 1,
      paid: true,
    },
    {
      id: 11,
      flatmate_id: 3,
      bill_id: 10,
      amount: 21.25,
      split: 1,
      paid: false,
    },
    {
      id: 12,
      flatmate_id: 4,
      bill_id: 10,
      amount: 21.25,
      split: 1,
      paid: true,
    },
  ])
}
