import React, { useMemo } from 'react'
import padStart from 'lodash/padStart'

import { useClock } from './clock_memo'

export const ClockUseMemo = () => {
  const now = useClock()
  const minutes = new Date(now).getMinutes()

  return useMemo(
    () => {
      console.log('rendering minutes')
      return (
        <span>
          {padStart(String(minutes), 2, '0')}
        </span>
      )
    },
    [minutes]
  )
}

