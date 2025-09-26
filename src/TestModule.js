import { Home } from 'lucide-react'
import React from 'react'

export const TestModule = ({name, age}) => {
  return (
    <div>
      <h1>Hello {name}</h1>
      <p>Your age is {age}</p>

    </div>
  )
}
