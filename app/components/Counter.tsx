import { useState } from "react"

export default function Counter() {
  const [n, setN] = useState(0)

  return <button onClick={() => setN(c => c + 1)}>Click me: {n}</button>
}