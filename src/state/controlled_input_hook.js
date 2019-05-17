import React, { useState } from 'react'
import { TextField, Button } from '@material-ui/core'

export const ControlledInputHook = () => {
  const [value, setValue] = useState('')

  const handleInput = event => setValue(event.target.value)

  const handleClick = () => alert(value)

  return (
    <div>
      <TextField
        label='Controlled by class'
        value={value}
        onInput={handleInput}
      />
      <Button onClick={handleClick}>Show</Button>
    </div>
  )
}
