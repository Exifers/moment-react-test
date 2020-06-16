import { SET_CONFIGURATION } from '../actions/api.js'

const defaultState = {
  configuration: null
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case SET_CONFIGURATION:
      return {
        ...state,
        configuration: action.payload
      }
    default:
      return state
  }
}
