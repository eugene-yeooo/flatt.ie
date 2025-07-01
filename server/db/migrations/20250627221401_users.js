/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('auth0_id').notNullable().unique()
    table.string('username').notNullable()
    table.string('email').notNullable()
    table.string('avatar_url')
    table
      .enum('account_type', ['flat_financer', 'flattie', 'guest'])
      .notNullable()
    table.decimal('credit').defaultTo(0)
    table.string('bio')
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('users')
}
