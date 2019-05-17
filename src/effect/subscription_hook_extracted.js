import React, { useEffect, useState } from 'react'

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(
    () => {
      const handler = () => setWindowWidth(window.innerWidth)
      window.addEventListener('resize', handler)
      return () => window.removeEventListener('resize', handler)
    }
  )
  return windowWidth
}

export const ExtractedHookSubscription = () => {
  const windowWidth = useWindowWidth()

  return (
    <div>Window is {windowWidth} pixels wide</div>
  )
}
