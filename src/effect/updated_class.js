import React, { Component, useEffect, useState } from 'react'
import Checkbox from '@material-ui/core/es/Checkbox/Checkbox'
import { Questionaire } from '../questionaire'

class QuestionAndAnswer extends Component {
  state = {
    lastQuestion: null,
    checked: null
  }

  static getDerivedStateFromProps (props, state) {
    if (props.question !== state.lastQuestion) {
      return {
        lastQuestion: props.question,
        checked: null
      }
    }
    return null
  }

  render () {
    return (
      <div>
        {this.props.question}
        <Checkbox
          indeterminate={this.state.checked === null}
          onChange={event => this.setState({checked: event.target.checked})}
          checked={!!this.state.checked}/>
      </div>
    )
  }
}

export const UpdatedClass = () => <Questionaire><QuestionAndAnswer/></Questionaire>
