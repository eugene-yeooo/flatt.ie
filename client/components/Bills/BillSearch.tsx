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
    <form className="relative flex w-full max-w-md" onSubmit={handleSubmit}>
      <div className="group flex w-full rounded-md border border-gray-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--primary)]">
        <input
          type="text"
          placeholder="Search bills..."
          value={query}
          onChange={handleChange}
          className="w-full rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              onSearch('')
            }}
            className="absolute right-20 top-2 px-3 font-black text-gray-500 transition hover:text-black"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}

        <button
          type="submit"
          className="rounded-r-md border border-l-0 border-gray-300 bg-white px-4 transition-colors hover:bg-[var(--primary)] hover:text-white 
                 group-focus-within:border-b-0 group-focus-within:border-t-0"
        >
          Search
        </button>
      </div>
    </form>
  )
}
