import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RootState from '../redux/rootState';
import { addmessages } from '../redux/action';
import { channelId } from '../config';
// import WebRTC from '../services/webRTC';

const useStyles = makeStyles((theme) => ({
    chat: {
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignContent: "row-reverse",

    },
    msg: {
        backgroundColor: "blue",
        borderRadius: "1rem",
        padding: "0.5rem 0.5rem",
        margin: "1rem",
        display: "inline-block",
        flexWrap: "wrap",
        width: "fit-content",
        maxWidth: "200px",
        whiteSpace: "initial",
        wordWrap: "break-word",
        color: "white",
        height: "fit-content",

    },
    right: {
        backgroundColor: "#E5E4E2",
        borderRadius: "1rem",
        padding: "0.5rem 0.5rem",
        margin: "1rem",
        display: "inline-block",
        flexWrap: "wrap",
        width: "fit-content",
        maxWidth: "200px",
        whiteSpace: "initial",
        wordWrap: "break-word",
        color: "black",
        height: "fit-content",
        float: "right",
        marginLeft: 'auto',
        marginRight: '0',
    },
    messages: {
        minHeight: "36vh",
        overflowY: "scroll",
        maxHeight: '36vh',
        display: "flex",
        flexDirection: 'column'
    }

}));

interface Props {
    userid: string,
}

const Chat: React.FC<Props> = (userid) => {

    const classes = useStyles()
    const webrtm = useSelector((state: RootState) => state.agora.rtmobj)
    const messages = useSelector((state: RootState) => state.messages)
    const [msg, setmsg] = useState<String>('')
    const dispatch = useDispatch()

    useEffect(() => {
        registerAgoraEvents()
    }, [])


    async function addMessageToChannel(data: any) {
        if (data.message.messageType === "IMAGE") {
            dispatch(addmessages("Image", data.message.mediaId, null, data.memberId, false))
        }
        else {
            dispatch(addmessages("Text", null, data.message.text, data.memberId, false))
        }

    }

    async function registerAgoraEvents() {
        webrtm.rtmEmitter.on("RtmEmitter", (data: any) => {
            switch (data.type) {
                // case 'state-changed': stateChanged(data)
                //     break;

                // case 'message-from-peer': addMessageFromPeer(data)
                //     break;

                // case 'member-join': addRemoteUser(data)
                //     break;

                // case 'member-left': removeRemoteUser(data)
                //     break;

                case 'channel-message': addMessageToChannel(data)
                    break;
            }
        })
    }



    async function onSubmitHandler(event: any) {
        event.preventDefault();
        await webrtm.sendChannelMessage(msg, channelId)
        dispatch(addmessages("Text", null, msg, userid.userid, true))
        console.log(messages, "messages")

    }


    function myChangeHandler(event: any) {
        setmsg(event.target.value);
    }

    async function fileUploadInputChange(e: any) {
        let blobFile = e.target.files[0];
        const blob = new Blob([blobFile], { type: 'jpeg/jpg/png' })
        const mediaMessage = await webrtm.publisher.rtmclient.createMediaMessageByUploading(blob, {
            messageType: 'IMAGE',
            fileName: 'agora.jpg',
            description: 'send image',
            thumbnail: undefined,
            width: 100,
            height: 200,
            thumbnailWidth: 50,
            thumbnailHeight: 200,
        })
        const id = mediaMessage.mediaId

        await webrtm.channel.sendMessage(mediaMessage)

        dispatch(addmessages('Image', id, null, userid.userid, true))

    };

    async function imageFromItem(id: any) {
        const blob = await webrtm.publisher.rtmclient.downloadMedia(id)
        return blob
    }

    return (
        <div className={classes.chat}>
            <div className={classes.messages}>

                {


                    messages.messages.length > 1 ?
                        (
                            messages.messages.map((item: any, key: any) => {

                                if (key === 0) {
                                    return
                                }
                                console.log("message ", item)
                                var msgclass = `${classes.msg}`
                                if (item.self) {
                                    msgclass = `${classes.right}`
                                }
                                if (item.messageType === 'Image') {


                                    var image = imageFromItem(item.mediaId)
                                    return (
                                        <li className={msgclass} key={key}>
                                            <p><b>{item.id}</b></p>
                                            <div>
                                                {image}
                                            </div>

                                        </li>
                                    )
                                }
                                if (item.messageType === 'Text') {

                                    return (
                                        <li className={msgclass} key={key}>
                                            <p><b>{item.id}</b></p>
                                            <p>{item.msg}</p>

                                        </li>
                                    )
                                }


                            })
                        )
                        :
                        ''
                }
            </div>
            <div >
                <form >
                    <input placeholder="Enter message" name="message" onChange={myChangeHandler}></input>
                    <button onClick={(e) => onSubmitHandler(e)}>Submit</button>
                    <input type="file" onChange={(event) => fileUploadInputChange(event)} />

                </form>

            </div>
        </div >
    )
}

export default Chat;