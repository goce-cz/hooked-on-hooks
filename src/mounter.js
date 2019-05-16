import React, { useState } from 'react'
import { Switch } from '@material-ui/core'

export const Mounter = ({ children }) => {
  const [mounted, setMounted] = useState(false)
  return (
    <>
      <Switch
        checked={mounted}
        onChange={event => setMounted(event.target.checked)}
      />
      {mounted && children}
    </>
  )
}
