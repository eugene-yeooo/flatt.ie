/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('payment', (table) => {
    table.increments('id').primary()
    table.integer('user_id')
    table.string('bill_id')
    table.decimal('amount')
    table.decimal('split').notNullable()
    table.boolean('paid')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('payment')
}
