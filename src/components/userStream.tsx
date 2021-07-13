import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import { red } from '@material-ui/core/colors';
import CallEndOutlinedIcon from '@material-ui/icons/CallEndOutlined';
import MicNoneOutlinedIcon from '@material-ui/icons/MicNoneOutlined';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import pic from '../assets/pic.jpg'
import { useSelector } from 'react-redux';
import RootState from '../redux/rootState';
import { useEffect } from 'react';
import { useState } from 'react';
import { channelId } from '../config';


const useStyles = makeStyles(() => ({
    root: {
        maxHeight: 460,
    },
    media: {
        height: "28vh",
        overflow: "hidden"
    },
    avatar: {
        backgroundColor: red[500],
    },
    icons: {
        textAlign: "center",
    },
    userData: {
        backgroundColor: 'rgba(0, 0, 0, 0.14)',
        textAlign: "center"
    }
}));


interface Props {
    name: string,
    email: string,
    id: string,
}


export const UserStream: React.FC<Props> = ({ name, email, id }) => {
    const classes = useStyles();
    const user = useSelector((state: RootState) => state.user)
    const elementId = `user-stream-${id}`
    const [screen, setscreen] = useState<Boolean>(false)
    const [mute, setmute] = useState<Boolean>(false)
    const [muteVideo, setmuteVideo] = useState<Boolean>(false)
    const webrtc = useSelector((state: RootState) => state.agora.obj)
    const webrtm = useSelector((state: RootState) => state.agora.rtmobj)

    useEffect(() => {

        const timer = setTimeout(() => {
            if (webrtc.publisher.tracks.video.length > 0) {
                webrtc.publisher.tracks.video.play(elementId)
            }

            return () => {
                if (webrtc.publisher.tracks.video.length > 0) {
                    webrtc.publisher.tracks.video.stop()
                }

            }
        }, 1000);
        return () => clearTimeout(timer);

    }, [webrtc.publisher.tracks, elementId]);

    useEffect(() => {

    }, [])

    // this.publisher.tracks.screenTrack.on('track-ended', this.trackHandler);


    async function onShareScreen() {
        // await webrtm.publisher.rtmclient.setChannelAttributes(channelId, { screenShare: "false" })

        if (!screen) {
            const attributes = await webrtm.publisher.rtmclient.getChannelAttributes(channelId)
            console.log(attributes, "attributes of channel")
            if (attributes.screenShare && attributes.screenShare.value === "true") {
                alert("You can't share your screen . SCreen sharing is limited to One")
            }
            else {
                await webrtm.publisher.rtmclient.setChannelAttributes(channelId, { screenShare: "true" })
                setscreen(true)
                const screenId = `remote-stream-${id}`;
                await webrtc.createScreenTrack();
                webrtc.screenPublish.tracks.screen.play(screenId);
            }

        }
        else {
            setscreen(false)
            await webrtm.publisher.rtmclient.setChannelAttributes(channelId, { screenShare: "false" })
            webrtc.screenPublish.tracks.screen.close();
            webrtc.UnpublishScreenTrack()

        }


    }

    async function onMuteAudio() {
        if (webrtc.publisher.tracks.audio && !mute) {
            setmute(true)
            await webrtc.publisher.tracks.audio.setEnabled(false)
        }
        else {
            setmute(false)
            await webrtc.publisher.tracks.audio.setEnabled(true)
        }

    }

    async function onMuteVideo() {
        if (webrtc.publisher.tracks.video && !muteVideo) {
            setmuteVideo(true)
            console.log("disable video")
            await webrtc.publisher.tracks.video.setEnabled(false)
        }
        else {
            setmuteVideo(false)
            await webrtc.publisher.tracks.video.setEnabled(true)
        }

    }


    useEffect(() => {

        webrtc.screenjoin()
        webrtc.createBothTracks()
            .then(() => {
                webrtc.publisher.tracks.video.play(elementId)
                //webrtc.streaming.next(true)
                webrtc.join(id).then(
                    () => {
                        webrtc.publish();
                        //webrtc.startCall();
                    }
                )
            })
    }, [elementId, webrtc.publisher])
    // const [loading, setloading] = useState(true)
    return (
        <Card className={classes.root}>
            <CardMedia
                className={classes.media}
                image={pic}
                id={elementId}

            />
            <CardContent className={classes.userData}>
                <p>
                    {user.name}
                </p>
                <p>
                    {user.email}
                </p>
                <p><b>{screen ? "You are Presenting" : ''}</b></p>
                <div className={classes.icons}>

                    <button style={{ borderRadius: "50%", border: "none", margin: "10px" }} onClick={() => onMuteAudio()}>
                        {
                            mute ?
                                <MicOffIcon />
                                :
                                <MicNoneOutlinedIcon />
                        }
                    </button>
                    <button style={{ borderRadius: "50%", border: "none", margin: "10px" }} onClick={() => onMuteVideo()}>
                        {
                            muteVideo ?
                                <VideocamOffIcon />
                                :
                                <VideocamOutlinedIcon />

                        }
                    </button>


                    <button style={{ borderRadius: "50%", border: "none", margin: "10px" }} onClick={() => onShareScreen()}>
                        {
                            screen ?
                                <StopScreenShareIcon />
                                :
                                <PresentToAllIcon />
                        }
                    </button>


                    <button style={{ backgroundColor: "red", borderRadius: "50%", border: "none", margin: "10px" }} ><CallEndOutlinedIcon /></button>
                </div>

            </CardContent>

        </Card>
    );
}
export default UserStream;