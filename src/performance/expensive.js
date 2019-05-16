import React, { useMemo, useState } from 'react'
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress'
import Button from '@material-ui/core/es/Button/Button'

const generateRandomNumbers = () => [...Array(200000).keys()].map(() => Math.random())

export const MedianVisualizer = ({ numbers }) => {
  const [valueUnderCursor, setValueUnderCursor] = useState(0)
  const median = useMemo(
    () => {
      numbers.sort()
      return numbers[Math.ceil(numbers.length / 2)]
    },
    [numbers]
  )

  const handleMouseMove = event => setValueUnderCursor(Math.round(10 * event.clientX / event.target.clientWidth) / 10)

  return (
    <div>
      Median is: {median}
      <LinearProgress
        value={median * 100}
        variant='determinate' onMouseMove={handleMouseMove}
        style={{ height: 20 }}
      />
      <div>Value under cursor: {valueUnderCursor}</div>
    </div>
  )
}

export const Expensive = () => {
  const [randomNumbers, setRandomNumbers] = useState(generateRandomNumbers)
  const handleClick = () => setRandomNumbers(generateRandomNumbers())

  return (
    <>
      <MedianVisualizer numbers={randomNumbers} onClick={handleClick}/>
      <Button onClick={handleClick}>Randomize</Button>
    </>
  )
}
