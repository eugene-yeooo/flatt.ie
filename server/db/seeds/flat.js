/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('flat').del()

  await knex('flat').insert([
    {
      id: 1,
      name: 'PavlovaPalace',
      address: '101 Whipped Cream Lane, Wellington',
      description: 'A sweet spot for dessert lovers.',
      invite_code: 'xxyyzz',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: 'FernFlat',
      address: '202 Native Grove, Auckland',
      description: 'Tucked in the bush with native vibes.',
      invite_code: 'aabbcc',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      name: 'MarmiteMansion',
      address: '303 Savoury Road, Christchurch',
      description: "You'll either love it or hate it.",
      invite_code: 'ddeeff',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ])
}
