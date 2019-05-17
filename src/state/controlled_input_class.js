import React, { Component } from 'react'
import { TextField, Button } from '@material-ui/core'

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
