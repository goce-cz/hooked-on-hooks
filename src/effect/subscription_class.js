import React, { Component } from 'react'

export class SubscriptionClass extends Component {
  state = {
    windowWidth: window.innerWidth
  }

  handleResize = () => this.setState({ windowWidth: window.innerWidth })

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  render () {
    return (
      <div>Window is {this.state.windowWidth} pixels wide</div>
    )
  }
}
