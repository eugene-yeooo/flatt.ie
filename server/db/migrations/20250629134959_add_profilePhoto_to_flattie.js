/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.table('flattie', (table) => {
    table.string('profilePhoto')
  })
}

export async function down(knex) {
  return knex.schema.table('flattie', (table) => {
    table.dropColumn('profilePhoto')
  })
}