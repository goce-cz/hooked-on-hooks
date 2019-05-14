import React, { useMemo, useRef, useState } from 'react'

const generateRandomNumbers = () => [...Array(200000).keys()].map(() => Math.random())

export const Expensive = () => {
  const [randomNumbers, setRandomNumbers] = useState(generateRandomNumbers)
  const [mouseCoordinates, setMouseCoordinates] = useState({ x: 0, y: 0 })
  const boxRef = useRef()
  const median = useMemo(
    () => {
      randomNumbers.sort()
      console.log(randomNumbers.slice(0, 5))
      return randomNumbers[Math.ceil(randomNumbers.length / 2)]
    },
    [randomNumbers]
  )

  const handleMouseMove = event => {
    const boundingClientRect = boxRef.current.getBoundingClientRect()
    setMouseCoordinates({ x: event.clientX - boundingClientRect.left, y: event.clientY - boundingClientRect.top })
  }

  const handleClick = () => setRandomNumbers(generateRandomNumbers)

  return (
    <div
      ref={boxRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      style={{ height: 200, position: 'relative' }}
    >
      Median is: {median}
      <div
        style={{
          background: 'red',
          position: 'absolute',
          width: 5,
          height: 5,
          left: 0,
          right: 0,
          // transition: 'transform 200ms linear',
          transform: `translate3d(${mouseCoordinates.x}px,${mouseCoordinates.y}px,0)`
        }}
      />
    </div>
  )
}
