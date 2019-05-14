import React from 'react'
import { useRoute } from 'react-router5'

import { DEFAULT_ROUTE } from './routes'
import { Sections } from './sections'

export const Root = () => {
  const { route } = useRoute()

  switch (route.name) {
    case DEFAULT_ROUTE:
      return (
        <Sections/>
      )
    default:
      return <p>404</p>
  }
}
