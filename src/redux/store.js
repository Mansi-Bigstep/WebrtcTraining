import { createStore } from 'redux'
import Reducer from './actionReducer'

const store = createStore(
    Reducer
)

export default store