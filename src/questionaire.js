import { useState } from 'react'
import React from 'react'
import Select from '@material-ui/core/es/Select/Select'
import MenuItem from '@material-ui/core/es/MenuItem/MenuItem'

const QUESTIONS = [
  'Do you like hooks?',
  'Do you like my brownbag?'
]
export const Questionaire = ({ children }) => {
  const [question, setQuestion] = useState(QUESTIONS[0])
  const child = React.Children.only(children)
  return (
    <>
      <div>
        {React.cloneElement(child, { question })}
      </div>
      <Select value={question} onChange={event => setQuestion(event.target.value)}>
        {QUESTIONS.map(question => <MenuItem value={question}>{question}</MenuItem>)}
      </Select>
    </>
  )
}