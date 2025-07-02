/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('users').del()
  await knex('users').insert([
    {
      id: 1,
      auth0_id: 'google-oauth2|111055554859323861743',
      username: 'keviiiin',
      name: 'Kevin',
      email: 'icebirbbb@gmail.com',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin',
      account_type: 'flat_financer',
      credit: 100.5,
      bio: 'hi',
    },
    {
      id: 2,
      auth0_id: 'google-oauth2|104981328910278296699',
      username: 'ar_a',
      name: 'Ara',
      email: 'happyaraola@gmail.com',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ara',
      account_type: 'flat_financer',
      credit: 100.5,
      bio: 'hi',
    },
    {
      id: 3,
      auth0_id: 'google-oauth2|114236890951684480861',
      username: 'eugennne',
      name: 'Eugene',
      email: 'eugeneyeoooo@gmail.com',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eugene',
      account_type: 'flat_financer',
      credit: 100.5,
      bio: 'hi',
    },
    {
      id: 5,
      auth0_id: 'auth0|685e6690e92c77c43ee7f07b',
      username: 'hannaaaah',
      name: 'Hannah',
      email: 'hchristinasmith@gmail.com',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hannah',
      account_type: 'flat_financer',
      credit: 100.5,
      bio: 'hi',
    },
  ])
}
