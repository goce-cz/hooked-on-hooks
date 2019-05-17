import React, { useCallback } from 'react'
import { Button, InputAdornment, TextField } from '@material-ui/core'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { useDispatch } from 'react-redux/es/hooks/useDispatch'

import { useDebounce } from '../hooks'
import { DEBOUNCE_DELAY } from '../constants'
import { changeValue, getValue } from '../store'

export const HookReduxInput = () => {
  const value = useSelector(getValue, [])
  const dispatch = useDispatch()
  const setValue = useCallback(
    value => dispatch(changeValue(value)),
    [dispatch]
  )
  const [
    interimValue,
    setDebouncedValue,
    setImmediateValue
  ] = useDebounce(value, setValue, DEBOUNCE_DELAY)

  const handleInput = event => setDebouncedValue(event.target.value)
  const handleClear = () => setImmediateValue('')

  return (
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
  )
}
