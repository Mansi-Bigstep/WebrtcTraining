import { combineReducers } from 'redux'
import WebRTC from '../services/webRTC'
import WebRTM from '../services/webRTM'
import { ADD_REMOTE } from './actionType'
import { ADD_DETAILS } from './actionType'
import { ADD_MESSAGES } from './actionType'
import { ADD_MEMBERS } from './actionType'

const initialState = {
    obj: new WebRTC(),
    rtmobj: new WebRTM()
}

const RemoteReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case ADD_REMOTE: return {
            ...state,
            remoteStreams: action.payload.remoteStreams
        }

        default: return state
    }
}

const initialMsgState = {
    messages: [{}]
}

const MessagesReducer = (state = initialMsgState, action: any) => {

    switch (action.type) {
        case ADD_MESSAGES:
            let messages = state.messages
            if (action.messageType === 'Image') {
                messages.push({ messageType: action.messageType, mediaId: action.mediaId, id: action.id, self: action.self })
            }
            else {
                messages.push({ messageType: action.messageType, msg: action.msg, id: action.id, self: action.self })
            }

            return {
                messages
            }

        default: return state
    }
}


const initialUserState = {
    name: '',
    email: '',
    channelId: ''
}

const userDetailsReducer = (state = initialUserState, action: any) => {
    console.log(action)
    switch (action.type) {
        case ADD_DETAILS: return {
            name: action.name,
            email: action.email,
            channelId: action.channelId
        }

        default: return state
    }
}


const initialMemberState = {
    members: []
}

const MemberReducer = (state = initialMemberState, action: any) => {
    console.log(state, "state of messages")
    switch (action.type) {
        case ADD_MEMBERS:
            let members = action.members
            console.log(members, "members from reducer")
            return {
                ...members
            }

        default: return state
    }
}

const Reducer = combineReducers({
    agora: RemoteReducer,
    user: userDetailsReducer,
    messages: MessagesReducer,
    members: MemberReducer
})


export default Reducer


