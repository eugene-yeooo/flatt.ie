/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('bill').del()

  const bills = []
  let id = 1

  const months = [
    { name: 'January', days: [6, 13, 20, 27], power: 31 },
    { name: 'February', days: [3, 10, 17, 24], power: 28 },
    { name: 'March', days: [3, 10, 17, 24], power: 31 },
    { name: 'April', days: [7, 14, 21, 28], power: 30 },
    { name: 'May', days: [5, 12, 19, 26], power: 31 },
    { name: 'June', days: [2, 9, 16, 23], power: 30 },
    { name: 'July', days: [7, 14, 21, 28], power: 31 },
    { name: 'August', days: [4, 11, 18, 25], power: 31 },
    { name: 'September', days: [1, 8, 15, 22], power: 30 },
    { name: 'October', days: [6, 13, 20, 27], power: 31 },
    { name: 'November', days: [3, 10, 17, 24], power: 30 },
    { name: 'December', days: [1, 8, 15, 22], power: 31 },
  ]

  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const month = months[monthIndex]
    const monthNumber = (monthIndex + 1).toString().padStart(2, '0')
    const year = 2025

    // Weekly Rent Bills
    for (const day of month.days) {
      bills.push({
        id: id++,
        title: `Week of ${day} ${month.name} Rent`,
        expense_category: 'Rent',
        due_date: `${year}-${monthNumber}-${day.toString().padStart(2, '0')}`,
        total_amount: 620.0,
      })
    }

    // Power
    bills.push({
      id: id++,
      title: `${month.name} ${year} Power Bill`,
      expense_category: 'Power',
      due_date: `${year}-${monthNumber}-${month.power}`,
      total_amount: 150 + Math.random() * 20,
    })

    // Internet
    bills.push({
      id: id++,
      title: `${month.name} ${year} Internet`,
      expense_category: 'Internet',
      due_date: `${year}-${monthNumber}-${month.power}`,
      total_amount: 85.0,
    })

    // Rubbish
    bills.push({
      id: id++,
      title: `${month.name} ${year} Rubbish`,
      expense_category: 'Rubbish',
      due_date: `${year}-${monthNumber}-${month.power}`,
      total_amount: 65.6,
    })
  }

  await knex('bill').insert(bills)
}
