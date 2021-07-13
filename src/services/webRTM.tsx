import AgoraRTM from 'agora-rtm-sdk'
import EventEmitter from "events";
import { appId } from '../config';
import { channelId } from '../config';



export default class WebRTM extends EventEmitter {

    publisher: any
    channel: any
    rtmEmitter: any
    loggedin: any
    userid: any
    screenShare: any
    constructor() {
        super()
        this.channel = ''
        this.rtmEmitter = new EventEmitter();
        this.publisher = {
            rtmclient: {}
        }
        // this.initRTMSession()
    }

    initRTMSession = async (id: String) => {
        console.log("called")
        // const url = window.location.pathname;
        // const id = url.substring(url.lastIndexOf('/') + 1);
        this.publisher.rtmclient = await AgoraRTM.createInstance(appId, { enableLogUpload: false })
        await this.publisher.rtmclient.login({ uid: id, token: null })
        await this.joinChannel(channelId)
    }

    joinChannel = async (channelId: any) => {

        this.channel = await this.publisher.rtmclient.createChannel(channelId)
        await this.channel.join()
        this.registerChannelEvents()
        this.registerClientEvents()
        this.screenShare = await this.publisher.rtmclient.getChannelAttributes(channelId)

    }

    registerClientEvents() {
        this.publisher.rtmclient.on('ConnectionStateChanged', this.onStateChanged);
        this.publisher.rtmclient.on('MessageFromPeer', this.onMessageFromPeer);
    }

    registerChannelEvents() {
        this.channel.on('ChannelMessage', this.onChannelMessage);
        this.channel.on('MemberJoined', this.onMemberJoin);
        this.channel.on('MemberLeft', this.onMemberLeft);
    }

    onStateChanged = async (state: any, reason: any) => {
        let emitData = { type: 'state-changed', state, reason };
        this.rtmEmitter.emit("RtmEmitter", emitData)
        // console.log(emitData, "emit data")
    }

    onMessageFromPeer = async (message: any, memberId: any) => {


        let emitData = { type: 'message-from-peer', message, memberId };
        this.rtmEmitter.emit("RtmEmitter", emitData)


        // console.log(emitData, "emit data")
    }
    onMemberJoin = async (memberId: any) => {
        let emitData = { type: 'member-join', memberId };
        this.rtmEmitter.emit("RtmEmitter", emitData)
        // console.log(emitData, "emit data")
    }

    onMemberLeft = async (memberId: any) => {
        let emitData = { type: 'member-left', memberId };
        this.rtmEmitter.emit("RtmEmitter", emitData)
        // console.log(emitData, "emit data")
    }

    onChannelMessage = async (message: any, memberId: any) => {

        // const blob = await this.publisher.rtmclient.downloadMedia(message.mediaId)
        // console.log("emsaaage", blob)
        // document.body.append(blob)

        let emitData = { type: 'channel-message', memberId, message };
        this.rtmEmitter.emit("RtmEmitter", emitData)

    }

    sendPeerMessage = async (message: any, peerId: any) => {
        return this.publisher.rtmclient.sendMessageToPeer({ message }, peerId.toString())
    }

    sendChannelMessage = async (message: any, channelId: any) => {
        if (!this.channel) return
        await this.channel.sendMessage({ text: message })
    }
    onScreenShare = async () => {
        await this.publisher.rtmclient.setChannelAttributes('test-rtm', { screenShare: "true" })

    }
    // sendMessage(){

    // }

}
