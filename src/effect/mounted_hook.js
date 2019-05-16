import React, { useEffect, useState } from 'react'
import { Mounter } from '../mounter'

const Animated = () => {
  const [opacity, setOpacity] = useState(0)
  useEffect(
    () => {
      setOpacity(1)
    },
    []
  )

  return (
    <div style={{ opacity, transition: 'opacity 3000ms linear' }}>
      I am fading in when mounted
    </div>
  )
}

export const MountedHook = () => <Mounter><Animated/></Mounter>
