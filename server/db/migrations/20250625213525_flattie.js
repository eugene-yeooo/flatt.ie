/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex) {
  return knex.schema.createTable('flattie', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.decimal('credit').defaultTo(0)
    table.decimal('debt').defaultTo(0)
    table.string('profile_photo')
    table.string('bio')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('flattie')
}
