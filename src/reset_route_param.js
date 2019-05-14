import React from 'react'
import {Button} from '@material-ui/core'

import { useRouteParam } from './hooks'

export const ResetRouteParam = ({ value }) => {
  const [, setValue] = useRouteParam('value')
  return <Button onClick={() => setValue(value)}>external change</Button>
}
