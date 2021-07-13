import AgoraRTC from "agora-rtc-sdk-ng"
import EventEmitter from "events";
import { appId } from '../config';
import { channelId } from '../config';

export default class WebRTC extends EventEmitter {

    publisher: any
    remoteStreams: any
    streaming: any
    screenPublish: any
    agora: any
    id: any
    screenSharing: any
    microphoneconfig: any
    credentials = {
        channelID: "",
        token: null,
        userId: null,
        appId: ""
    };
    constructor() {
        super()
        this.publisher = {
            screenClient: "",
            tracks: {
                video: {},
                audio: {},
                screen: {}
            }
        };
        this.remoteStreams = [{

        }]
        this.screenPublish = {
            tracks: {
                screen: {}
            }
        };
        this.id = ''
        this.screenSharing = false
        this.publisher.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        this.screenPublish.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        this.streaming = new EventEmitter();
        this.agora = new EventEmitter();
        this.credentials = {
            channelID: channelId,
            token: null,
            userId: null,
            appId: appId
        }
        this.microphoneconfig = {
            AEC: true, // acoustic echo cancellation
            AGC: true, // audio gain control
            ANS: true, // automatic noise suppression
            encoderConfig: 'speech_standard',
        }

    }


    createVideoTrack = async () => {
        this.publisher.tracks.video = await AgoraRTC.createCameraVideoTrack(
            {
                encoderConfig: "120p_1"
            }
        );
    }


    createAudioTrack = async () => {


        this.publisher.tracks.audio = await AgoraRTC.createMicrophoneAudioTrack(this.microphoneconfig);
        this.publisher.client.enableAudioVolumeIndicator();

    }

    async createScreenTrack() {

        await AgoraRTC.createScreenVideoTrack({
            encoderConfig: "720p_1",
        }).then(localScreenTrack => {
            this.screenPublish.tracks.screen = localScreenTrack;
        });
        this.publishScreenTrack();

    }

    async publishScreenTrack() {
        return await this.screenPublish.client.publish([this.screenPublish.tracks.screen]);
    }
    async UnpublishScreenTrack() {
        return await this.screenPublish.client.unpublish([this.screenPublish.tracks.screen]);

    }
    createBothTracks = async () => {
        try {
            await this.createVideoTrack();
            await this.createAudioTrack();

        }
        catch (err) {
            throw err;
        }
    }


    join(id: string) {
        if (this.publisher.client) {
            this.registerClientEvents()
            return this.publisher.client.join(
                this.credentials.appId,
                this.credentials.channelID,
                this.credentials.token,
                id
            );
        }
    }


    screenjoin() {
        if (this.screenPublish.client && appId) {
            const url = window.location.pathname;
            const id = url.substring(url.lastIndexOf('/') + 1);
            return this.screenPublish.client.join(
                appId,
                channelId,
                null,
                `${id}Screen`

            );
        }
    }


    async publish() {
        await this.publisher.client.setClientRole("host")
        return this.publisher.client.publish([
            this.publisher.tracks.audio,
            this.publisher.tracks.video,
        ]);
    }
    registerClientEvents() {
        this.publisher.client.on('user-published', this.onUserPublished);
        this.publisher.client.on('user-unpublished', this.onUserUnpublished);
        this.publisher.client.on('mute-audio', this.onUserMute);
        this.publisher.client.on('user-joined', this.onUserJoined);
        this.publisher.client.on('user-left', this.onUserLeft);
        this.publisher.client.on('volume-indicator', this.onVolumeIndicator);

        // this.publisher.client.on('network-quality', this.onNetworkQuality);
    }

    onUserPublished = async (user: any, mediaType: any) => {
        console.log("userpublished called")
        if (user.uid.includes('Screen')) {
            this.screenSharing = true
        }
        const url = window.location.pathname;
        const id = url.substring(url.lastIndexOf('/') + 1);
        if (user.uid !== `${id}Screen`) {
            await this.publisher.client.subscribe(user, mediaType);
        }
        // await this.publisher.client.setStreamFallbackOption(uid, 1);
        if (mediaType === 'video') {
            // this.setRemoteStreamType(uid, 'low');
        }
        if (mediaType === 'audio') {
        }
        let emitData = { type: 'user-published', user, mediaType };

        this.agora.emit("Emitter", emitData);
    }

    onUserUnpublished = async (user: any, mediaType: any) => {
        if (user.uid.includes('Screen')) {
            this.screenSharing = false
        }
        await this.publisher.client.unsubscribe(user, mediaType);
        if (mediaType === 'video') {
            console.log('unsubscribe video success');
        }
        if (mediaType === 'audio') {
            console.log('unsubscribe audio success');
        }
        let emitData = { type: 'user-unpublished', user, mediaType };
        this.agora.emit("Emitter", emitData);

    };

    onUserJoined() { }

    onUserLeft() { }


    onUserMute() {
        console.log('hey calling from onMute')
    }
    onVolumeIndicator = async (evt: any) => {
        let emitData = { type: 'remoteuser-volume', evt };
        this.agora.emit("Emitter", emitData);
    }



}
