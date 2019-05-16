import React, { useEffect, useState } from 'react'
import Checkbox from '@material-ui/core/es/Checkbox/Checkbox'
import { Questionaire } from '../questionaire'

const QuestionAndAnswer = ({ question }) => {
  const [checked, setChecked] = useState(null)

  useEffect(
    () => {
      setChecked(null)
    },
    [question]
  )

  return (
    <div>
      {question}
      <Checkbox
        indeterminate={checked === null}
        onChange={event => setChecked(event.target.checked)}
        checked={!!checked}/>
    </div>
  )
}

export const UpdatedHook = () => <Questionaire><QuestionAndAnswer/></Questionaire>
