import React, { Component } from 'react'
import { TextField } from '@material-ui/core'
import { withRoute } from 'react-router5'

export class RouteInputClass extends Component {
  handleInput = async event => {
    const {
      route,
      router
    } = this.props

    router.navigate(
      route.name,
      { ...route.params, value: event.target.value },
      { replace: true }
    )
  }

  render () {
    const {
      route
    } = this.props

    return (
      <TextField
        label='Controlled by class'
        value={route.params.value || ''}
        onInput={this.handleInput}
        fullWidth
      />
    )
  }
}

RouteInputClass = withRoute(RouteInputClass)
