import React, { Component } from 'react'
import { TextField } from '@material-ui/core'
import Button from '@material-ui/core/es/Button/Button'

export class ControlledInputClass extends Component {
  state = {
    value: ''
  }

  handleInput = event => this.setState({ value: event.target.value })

  handleClick = () => alert(this.state.value)

  render () {
    return (
      <div>
        <TextField
          label='Controlled by class'
          value={this.state.value}
          onInput={this.handleInput}
        />
        <Button onClick={this.handleClick}>Show</Button>
      </div>
    )
  }
}
