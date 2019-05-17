import React, { useEffect, useRef, useState } from 'react'
import { Button, InputAdornment, TextField } from '@material-ui/core'
import debounce from 'lodash/debounce'

import { useRouteParam } from '../hooks'
import { DEBOUNCE_DELAY } from '../constants'
import { ResetRouteParam } from '../reset_route_param'

const useDebounce = (value, setValue, delay) => {
  const [interim, setInterim] = useState(value)
  const debouncedSetValueRef = useRef(null)

  useEffect(
    () => {
      // this updates the interim value whenever the persisted one or any dependency changes
      setInterim(value)
      if(debouncedSetValueRef.current) {
        debouncedSetValueRef.current.cancel()
      }
    }, [value, setInterim]
  )

  useEffect(
    () => {
      debouncedSetValueRef.current = debounce(
        newValue => setValue(newValue),
        delay
      )
      return () => {
        // any pending call to the debounced function will be canceled
        // when any of the dependencies change
        debouncedSetValueRef.current.cancel()
      }
    },
    [setValue, debouncedSetValueRef, delay]
  )

  const setDebounced = newValue => {
    setInterim(newValue)
    debouncedSetValueRef.current(newValue)
  }

  const setImmediate = newValue => {
    setDebounced(newValue)
    debouncedSetValueRef.current.flush()
  }

  return [interim, setDebounced, setImmediate]
}

export const ExtractedHookDebouncedInput = () => {
  const [value, setValue] = useRouteParam('value', '')
  const [
    interimValue,
    setDebouncedValue,
    setImmediateValue
  ] = useDebounce(value, setValue, DEBOUNCE_DELAY)

  const handleInput = event => setDebouncedValue(event.target.value)
  const handleClear = () => setImmediateValue('')

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
