import React, { useEffect, useRef, useState } from 'react'
import { Button, InputAdornment, TextField } from '@material-ui/core'
import debounce from 'lodash/debounce'

import { useRouteParam } from '../hooks'
import { DEBOUNCE_DELAY } from '../constants'
import { ResetRouteParam } from '../reset_route_param'

export const DebouncedInputHook = () => {
  const [value, setValue] = useRouteParam('value', '')
  let [interimValue, setInterimValue] = useState(value)
  const debouncedSetValue = useRef(null)

  useEffect(
    () => {
      // this updates the interim value whenever the persisted one or any dependency changes
      setInterimValue(value)
      interimValue = value
      if(debouncedSetValue.current) {
        debouncedSetValue.current.cancel()
      }
    }, [value, setInterimValue]
  )

  useEffect(
    () => {
      debouncedSetValue.current = debounce(
        newValue => setValue(newValue),
        DEBOUNCE_DELAY
      )
      return () => {
        // any pending call to the debounced function will be canceled
        // when any of the dependencies change
        debouncedSetValue.current.cancel()
      }
    },
    [setValue, debouncedSetValue]
  )

  const handleInput = event => {
    const newValue = event.target.value
    setInterimValue(newValue)
    debouncedSetValue.current(newValue)
  }
  const handleClear = () => setValue('')

  return (
    <>
      <TextField
        label='Controlled by hook'
        value={interimValue}
        onInput={handleInput}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <Button
                onClick={handleClear}
                disabled={interimValue === ''}
              >
                X
              </Button>
            </InputAdornment>
          )
        }}
      />
      <ResetRouteParam value='reset'/>
    </>
  )
}
