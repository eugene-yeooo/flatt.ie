/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('flattie').del()
  await knex('flattie').insert([
    {
      id: 1,
      name: 'Hannah',
      credit: 1000,
      debt: 0,
      profile_photo: null,
    },
    {
      id: 2,
      name: 'Kevin',
      credit: 354,
      debt: 500,
      profile_photo: null,
    },
    {
      id: 3,
      name: 'Eugene',
      credit: 354,
      debt: 2345,
      profile_photo: null,
    },
    {
      id: 4,
      name: 'Ara',
      credit: 435,
      debt: 34,
      profile_photo: null,
    },
  ])
}
