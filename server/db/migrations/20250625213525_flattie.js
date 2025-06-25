/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex) {
  return knex.schema.createTable('fruit', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.decimal('credit').defaultTo(0)
    table.decimal('debt').defaultTo(0)
    table.decimal('balance').defaultTo(0)
  })
}

export async function down(knex) {
  return knex.schema.dropTable('flatties')
}
