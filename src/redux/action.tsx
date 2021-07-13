import { ADD_DETAILS, ADD_REMOTE, ADD_MESSAGES, ADD_MEMBERS } from './actionType'

export const addRemote = (remoteStreams: any) => {
    return {
        type: ADD_REMOTE,
        remoteStreams: remoteStreams
    }
}

export const addUserDetails = (name: any, email: any) => {
    return {
        type: ADD_DETAILS,
        name: name,
        email: email,
        // channelId: channelId
    }
}
export const addmessages = (messageType: any, mediaId: any, msg: any, id: any, self: any) => {
    return {
        type: ADD_MESSAGES,
        messageType: messageType,
        mediaId: mediaId,
        msg: msg,
        id: id,
        self: self
        // channelId: channelId
    }
}
export const addmembers = (members: Array<String>) => {
    return {
        type: ADD_MEMBERS,
        members: members
    }
}

