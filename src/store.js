import { createStore } from 'redux'

const INITIAL_STATE = {value: ''}
const VALUE_CHANGED_ACTION = 'VALUE_CHANGED_ACTION'

export const store = createStore((state = INITIAL_STATE, action) => {
  if (action.type === VALUE_CHANGED_ACTION) {
    return {
      ...state,
      value: action.value
    }
  }
  return state
})

export const changeValue = value => ({ type: VALUE_CHANGED_ACTION, value })

export const getValue = state => state.value
