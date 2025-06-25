/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('payment', (table) => {
    table.increments('id')
    table.increments('flatmate_id')
    table.string('bill_id')
    table.decimal('amount')
    table.boolean('paid')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('payment')
}
