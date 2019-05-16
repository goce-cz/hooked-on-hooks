import React, { memo, useCallback, useState } from 'react'
import Button from '@material-ui/core/es/Button/Button'

import { useClock } from './clock_memo'

const MemoizedButton = memo(({ caption, onClick }) => (
  <Button onClick={onClick}>{caption}</Button>
))

export const StopwatchCallback = () => {
  const now = useClock()
  const [lap, setLap] = useState(now)

  const handleReset = useCallback(
    () => setLap(Date.now()),
    [setLap]
  )

  const elapsed = now - lap
  const elapsedSeconds = Math.round(elapsed / 1000)

  return (
    <div>{elapsedSeconds} ms <MemoizedButton caption='reset' onClick={handleReset}/></div>
  )
}
