import React, { Component } from 'react'
import Checkbox from '@material-ui/core/es/Checkbox/Checkbox'

import { Questionnaire } from '../questionnaire'

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

export const ClassUpdated = () => <Questionnaire><QuestionAndAnswer/></Questionnaire>
