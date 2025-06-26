import { useEffect, useState } from "react"

interface Flatmate {
  id: number
  name: string
  credit: number
  debt: number
}

export default function Flatties() {
  const [flatmates, setFlatmates] = useState<Flatmate[]>([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/v1/flatties')
      const data = await res.json()
      console.log('Fetched flatmates:', data)

      const flatmateList = Array.isArray(data)
      ? data
      : data.flatmates || []

      setFlatmates(flatmateList)
    }
    fetchData()
  }, [])

  return (
    <div>
      <h1>Flatmates</h1>
      <ul>
        {flatmates.map((mate) => (
          <li key={mate.id}>
            <strong>{mate.name}</strong> <br />
            Credit: ${mate.credit} <br />
            Debt: ${mate.debt} <br />
            Balance: ${mate.credit - mate.debt}
          </li>
        ))}
      </ul>
    </div>
  )
}