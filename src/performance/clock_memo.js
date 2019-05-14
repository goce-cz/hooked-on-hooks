import React, { memo, useEffect, useState } from 'react'
import padStart from 'lodash/padStart'

export const useClock = () => {
  const [time, setTime] = useState(Date.now())
  useEffect(
    () => {
      const interval = setInterval(
        () => setTime(Date.now()),
        1000
      )
      return () => clearInterval(interval)
    }
  )
  return time
}

const Minutes = memo(({ minutes }) => {
  console.log('rendering minutes')
  return padStart(String(minutes), 2, '0')
})

export const ClockMemo = () => {
  const now = useClock()
  const date = new Date(now)
  const seconds = date.getSeconds()
  const minutes = date.getMinutes()

  return (
    <span>
      <Minutes minutes={minutes}/>:{padStart(String(seconds), 2, '0')}
    </span>
  )
}

