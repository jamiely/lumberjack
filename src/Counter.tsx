import { useState } from 'react'

interface CounterProps {
  initialCount?: number
}

export function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = useState(initialCount)

  return (
    <button onClick={() => setCount(count + 1)}>
      count is {count}
    </button>
  )
}