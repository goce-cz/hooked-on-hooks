import React, { useEffect, useState } from 'react'

export const HookSubscription = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(
    () => {
      const handler = () => setWindowWidth(window.innerWidth)
      window.addEventListener('resize', handler)
      return () => window.removeEventListener('resize', handler)
    }
  )
  return (
    <div>Window is {windowWidth} pixels wide</div>
  )
}
