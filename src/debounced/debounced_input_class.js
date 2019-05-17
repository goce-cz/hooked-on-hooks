import React, { Component } from 'react'
import { TextField, Button, InputAdornment } from '@material-ui/core'
import { withRoute } from 'react-router5'
import debounce from 'lodash/debounce'

import { ResetRouteParam } from '../reset_route_param'
import { DEBOUNCE_DELAY } from '../constants'

export class ClassDebouncedInput extends Component {
  state = {
    interimValue: '',
    lastRouteValue: ''
  }

  updateRoute = value => {
    const {
      route,
      router
    } = this.props
    this.setState({lastRouteValue: value})
    router.navigate(
      route.name,
      { ...route.params, value },
      { replace: true }
    )
  }

  debouncedUpdateRoute = debounce(this.updateRoute, DEBOUNCE_DELAY)

  handleInput = event => {
    const value = event.target.value
    this.setState({ interimValue: value })
    this.debouncedUpdateRoute(value)
  }

  handleClear = () => {
    this.setState({ interimValue: '' })
    this.debouncedUpdateRoute('')
    this.debouncedUpdateRoute.flush()
  }

  static getDerivedStateFromProps (props, state) {
    const incomingValue = props.route.params.value || ''
    if (incomingValue !== state.lastRouteValue) {
      return {
        interimValue: incomingValue,
        lastRouteValue: incomingValue
      }
    }
    return null
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.state.lastRouteValue !== prevState.lastRouteValue) {
      this.debouncedUpdateRoute.cancel()
    }
  }

  render () {
    return (
      <>
        <TextField
          label='Controlled by class'
          value={this.state.interimValue}
          onInput={this.handleInput}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <Button
                  onClick={this.handleClear}
                  disabled={this.state.interimValue === ''}
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
}

ClassDebouncedInput = withRoute(ClassDebouncedInput)
