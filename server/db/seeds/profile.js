/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('profiles').del()

  await knex('profiles').insert([
    {
      id: 1,
      user_id: 1,
      profile_name: 'Kevin',
      account_type: 'guest',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      user_id: 2,
      profile_name: 'Ara',
      account_type: 'flattie',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      user_id: 3,
      profile_name: 'Eugene',
      account_type: 'finance_manager',
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ])
}
