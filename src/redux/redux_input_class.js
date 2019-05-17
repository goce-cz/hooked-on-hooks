import React, { Component } from 'react'
import { TextField, Button, InputAdornment } from '@material-ui/core'
import debounce from 'lodash/debounce'

import { DEBOUNCE_DELAY } from '../constants'
import { connect } from 'react-redux'
import { changeValue, getValue } from '../store'

export class ClassReduxInput extends Component {
  state = {
    interimValue: '',
    lastStoreValue: ''
  }

  updateStore = value => {
    this.setState({ lastStoreValue: value })
    this.props.onChangeValue(value)
  }

  debouncedUpdateStore = debounce(this.updateStore, DEBOUNCE_DELAY)

  handleInput = event => {
    const value = event.target.value
    this.setState({ interimValue: value })
    this.debouncedUpdateStore(value)
  }

  handleClear = () => {
    this.setState({ interimValue: '' })
    this.debouncedUpdateStore('')
    this.debouncedUpdateStore.flush()
  }

  static getDerivedStateFromProps (props, state) {
    const incomingValue = props.value || ''
    if (incomingValue !== state.lastStoreValue) {
      return {
        interimValue: incomingValue,
        lastStoreValue: incomingValue
      }
    }
    return null
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.state.lastStoreValue !== prevState.lastStoreValue) {
      this.debouncedUpdateStore.cancel()
    }
  }

  render () {
    return (
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
    )
  }
}

const mapStateToProps = state => ({
  value: getValue(state)
})

const mapDispatchToProps = {
  onChangeValue: changeValue
}

ClassReduxInput = connect(mapStateToProps, mapDispatchToProps)(ClassReduxInput)
