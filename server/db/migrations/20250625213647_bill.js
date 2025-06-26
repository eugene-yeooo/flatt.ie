/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('bill', (table) => {
    table.increments('id')
    table.string('title')
    table.string('expense_category')
    table.date('due_date')
    table.decimal('total_amount')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('bill')
}
