/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('expense', (table) => {
    table.increments('id')
    table.string('category').notNullable()
    table.enu('frequency', ['monthly', 'weekly', 'one_off']).notNullable()
    table.decimal('default_amount')
    table.string('calc_method')
    table.text('notes')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('expense')
}
