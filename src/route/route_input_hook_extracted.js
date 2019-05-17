import React from 'react'
import { TextField } from '@material-ui/core'
import { useRoute} from 'react-router5'

const useRouteParam = (name, defaultValue) => {
  const { route, router } = useRoute()
  const handleChange = newValue => router.navigate(
    route.name,
    {
      ...route.params,
      value: newValue
    },
    { replace: true }
  )

  return [
    route.params[name] || defaultValue,
    handleChange
  ]
}

export const ExtractedHookRouteInput = () => {
  const [value, setValue] = useRouteParam('value', '')

  const handleInput = event => setValue(event.target.value)

  return (
    <TextField
      label='Controlled by hook'
      value={value}
      onInput={handleInput}
      fullWidth
    />
  )
}
