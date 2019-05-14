import React from 'react'
import { TextField } from '@material-ui/core'
import { useRoute } from 'react-router5'

export const RouteInputHook = () => {
  const { route, router } = useRoute()

  const handleInput = event => router.navigate(
    route.name,
    {
      ...route.params,
      value: event.target.value
    },
    { replace: true }
  )

  return (
    <TextField
      label='Controlled by hook'
      value={route.params.value || ''}
      onInput={handleInput}
      fullWidth
    />
  )
}
