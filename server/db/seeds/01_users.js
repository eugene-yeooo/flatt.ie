/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('users').del()
  await knex('users').insert([
    {
      id: 1,
      auth0_id: 'auth0|1',
      username: 'keviiiin',
      name: 'Kevin',
      email: 'kevin@example.com',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin',
      account_type: 'flattie',
      credit: 100.5,
      debt: 20,
      bio: 'hi',
    },
    {
      id: 2,
      auth0_id: 'auth0|2',
      username: 'ar_a',
      name: 'Ara',
      email: 'ara@example.com',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ara',
      account_type: 'finance_manager',
      credit: 100.5,
      debt: 20,
      bio: 'hi',
    },
    {
      id: 3,
      auth0_id: 'auth0|3',
      username: 'eugennne',
      name: 'Eugene',
      email: 'eugene@example.com',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eugene',
      account_type: 'guest',
      credit: 100.5,
      debt: 20,
      bio: 'hi',
    },
    {
      id: 5,
      auth0_id: 'auth0|685e6690e92c77c43ee7f07b',
      username: 'hannaaaah',
      name: 'Hannah',
      email: 'hannah@example.com',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hannah',
      account_type: 'flattie',
      credit: 100.5,
      debt: 20,
      bio: 'hi',
    },
  ])
}
