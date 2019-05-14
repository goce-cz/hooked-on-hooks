import React, { useEffect, useRef, useState } from 'react'
import { Button, InputAdornment, TextField } from '@material-ui/core'
import debounce from 'lodash/debounce'

import { useRouteParam } from '../hooks'
import { DEBOUNCE_DELAY } from '../constants'
import { ResetRouteParam } from '../reset_route_param'

const useDebounce = (value, setValue, delay) => {
  let [interim, setInterim] = useState(value)
  const debouncedSetValue = useRef(null)

  useEffect(
    () => {
      // this updates the interim value whenever the persisted one or any dependency changes
      setInterim(value)
      interim = value
      if(debouncedSetValue.current) {
        debouncedSetValue.current.cancel()
      }
    }, [value, setInterim]
  )

  useEffect(
    () => {
      debouncedSetValue.current = debounce(
        newValue => setValue(newValue),
        delay
      )
      return () => {
        // any pending call to the debounced function will be canceled
        // when any of the dependencies change
        debouncedSetValue.current.cancel()
      }
    },
    [setValue, debouncedSetValue, delay]
  )

  const setDebounced = newValue => {
    setInterim(newValue)
    debouncedSetValue.current(newValue)
  }

  return [interim, setDebounced]
}

export const DebouncedInputHookExtracted = () => {
  const [value, setValue] = useRouteParam('value', '')
  const [
    interimValue,
    setDebouncedValue
  ] = useDebounce(value, setValue, DEBOUNCE_DELAY)

  const handleInput = event => setDebouncedValue(event.target.value)
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
