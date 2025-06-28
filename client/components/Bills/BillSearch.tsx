import { useState } from 'react'

export default function BillSearch({
  onSearch,
}: {
  onSearch: (query: string) => void
}) {
  const [query, setQuery] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSearch(query.trim().toLowerCase())
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearch(newQuery.trim().toLowerCase())
  }

  return (
    <form className="flex w-full max-w-md" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search bills..."
        value={query}
        onChange={handleChange}
        className="w-full rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        className="rounded-r-md border border-l-0 border-gray-300 bg-white px-4 py-2 hover:bg-orange-400"
      >
        Search
      </button>
    </form>
  )
}
