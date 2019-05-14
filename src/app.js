import React from 'react'
import { RouterProvider } from 'react-router5'

import { Root } from './root'
import { router } from './routes'
import { Provider } from 'react-redux'
import { store } from './store'

router.start()

export const App = () => (
  <RouterProvider router={router}>
    <Provider store={store}>
      <Root/>
    </Provider>
  </RouterProvider>
)
