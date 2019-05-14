import React from 'react'
import identity from 'lodash/identity'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import ReactJson from 'react-json-view'

export const StoreDump = () => {
  const state = useSelector(identity, [])
  return (
    <div>
      <h4>Store content</h4>
      <ReactJson src={state}/>
    </div>
  )
}
