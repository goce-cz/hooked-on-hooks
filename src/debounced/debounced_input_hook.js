import React, { useEffect, useRef, useState } from 'react'
import { Button, InputAdornment, TextField } from '@material-ui/core'
import debounce from 'lodash/debounce'

import { useRouteParam } from '../hooks'
import { DEBOUNCE_DELAY } from '../constants'
import { ResetRouteParam } from '../reset_route_param'

export const HookDebouncedInput = () => {
  const [value, setValue] = useRouteParam('value', '')
  const [interimValue, setInterimValue] = useState(value)
  const debouncedSetValueRef = useRef(null)

  useEffect(
    () => {
      // this updates the interim value whenever the persisted one or any dependency changes
      setInterimValue(value)
      if(debouncedSetValueRef.current) {
        debouncedSetValueRef.current.cancel()
      }
    }, [value, setInterimValue]
  )

  useEffect(
    () => {
      debouncedSetValueRef.current = debounce(
        newValue => setValue(newValue),
        DEBOUNCE_DELAY
      )
      return () => {
        // any pending call to the debounced function will be canceled
        // when any of the dependencies change
        debouncedSetValueRef.current.cancel()
      }
    },
    [setValue, debouncedSetValueRef]
  )

  const handleInput = event => {
    const newValue = event.target.value
    setInterimValue(newValue)
    debouncedSetValueRef.current(newValue)
  }

  const handleClear = () => {
    setInterimValue('')
    debouncedSetValueRef.current('')
    debouncedSetValueRef.current.flush()
  }

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
