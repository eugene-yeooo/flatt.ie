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
      username: 'PavlovaPalace',
      email: 'pavlova.palace@example.com',
      avatar_url:
        'https://api.dicebear.com/7.x/avataaars/svg?seed=PavlovaPalace',
    },
    {
      id: 2,
      auth0_id: 'auth0|2',
      username: 'FernFlat',
      email: 'fern.flat@example.com',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FernFlat',
    },
    {
      id: 3,
      auth0_id: 'auth0|3',
      username: 'MarmiteMansion',
      email: 'marmite.mansion@example.com',
      avatar_url:
        'https://api.dicebear.com/7.x/avataaars/svg?seed=MarmiteMansion',
    },
    {
      id: 5,
      auth0_id: 'auth0|685e6690e92c77c43ee7f07b',
      username: 'Hannah',
      email: 'marmite.mansion@example.com',
      avatar_url:
        'https://api.dicebear.com/7.x/avataaars/svg?seed=MarmiteMansion',
    },
  ])
}
