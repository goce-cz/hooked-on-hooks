import React, { Component } from 'react'
import { Mounter } from '../mounter'

class Animated extends Component {
  state = {
    opacity: 0
  }

  componentDidMount () {
    setTimeout(
      () => this.setState({ opacity: 1 }),
      1
    )

  }

  render () {
    console.log(this.state.opacity)
    return (
      <div style={{ opacity: this.state.opacity, transition: 'opacity 3000ms linear' }}>
        I am fading in when mounted
      </div>
    )
  }
}

export const ClassMounted = () => <Mounter><Animated/></Mounter>
