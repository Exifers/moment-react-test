import { createStore, combineReducers } from 'redux'
import APIReducer from '../reducers/APIReducer'

export default createStore(combineReducers({
  api: APIReducer
}))
