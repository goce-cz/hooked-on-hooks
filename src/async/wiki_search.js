import React from 'react'
import { Button, InputAdornment, TextField, Typography, CircularProgress } from '@material-ui/core'

import { useDebounce, useDelayedValue, useLastAvailable, useRouteParam, useTask } from '../hooks'

const searchWiki = async query => {
  const escapedQuery = encodeURIComponent(query)
  const host = query === 'trump'
    ? 'http://go-to-hell.yeah'
    : 'http://localhost:3000'

  const response = await fetch(`${host}/w/api.php?action=query&list=search&srsearch=${escapedQuery}&format=json`)
  if (response.ok) {
    const json = await response.json()
    return json.query.search
  } else {
    throw new Error(`server responded with ${response.status}`)
  }
}

export const WikiSearch = () => {
  const [query, setQuery] = useRouteParam('wikiSearch', '')
  const [
    interimQuery,
    setDebouncedQuery,
    setImmediateQuery
  ] = useDebounce(query, setQuery, 1000)

  const handleInput = event => setDebouncedQuery(event.target.value)
  const handleClear = () => setImmediateQuery('')

  const { pending, value: results, error } = useTask(
    async () => {
      if (query.length > 2) {
        return searchWiki(query)
      } else {
        return []
      }
    },
    [query]
  )

  const delayedPending = useDelayedValue(pending, 500)

  const lastResults = useLastAvailable(results)

  return (
    <>
      <TextField
        label='Search Wikipedia'
        value={interimQuery}
        onInput={handleInput}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <Button
                onClick={handleClear}
                disabled={interimQuery === ''}
              >
                X
              </Button>
            </InputAdornment>
          )
        }}
      />
      <div>
        {
          query && delayedPending &&
          <CircularProgress/>
        }
        {
          error &&
          <Typography variant='body1' color='error'>{error.message}</Typography>
        }
        {
          query.length > 2 && lastResults &&
          <ul>
            {lastResults.map((page, index) => <li key={index}>{page.title}</li>)}
          </ul>
        }
      </div>
    </>
  )
}
