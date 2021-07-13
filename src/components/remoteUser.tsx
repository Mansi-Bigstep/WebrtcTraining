import { makeStyles } from '@material-ui/core/styles';
import MicNoneOutlinedIcon from '@material-ui/icons/MicNoneOutlined';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import React, { useEffect } from 'react';
import Grid, { GridSize } from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RootState from '../redux/rootState'
import { addmembers } from '../redux/action'
import pic from '../assets/pic.jpg'

interface Props {
    userid: string,
}

const useStyles = makeStyles(() => ({
    screen: {
        margin: 'auto',
        width: "100%",
        height: "100%",

    },
    userCol: {
        maxHeight: "95vh",
        padding: "0",
        display: "flex",
        flexDirection: "column",
        overflowY: "scroll"
    },
    userRow: {

        padding: "0",
        display: "flex",
    },
    root: {
        width: "100%",
        height: "98vh",
        display: 'flex',
        margin: 'auto',


    },
    userData: {

        backgroundColor: "white",
    },
    media: {
        height: "25vh",
        overflow: "hidden"
    },
    screenmedia: {
        height: "70vh",

    },
    card: {
        margin: "5px",
    }


}));

const MainWindow: React.FC<Props> = ({ userid }) => {
    const webrtc = useSelector((state: RootState) => state.agora.obj)
    const allUser: any = {}
    const [users, setallUser] = useState<Array<Object>>([])
    const screendata: any = {}
    const [screen, setscreen] = useState<any>({})
    const webrtm = useSelector((state: RootState) => state.agora.rtmobj)
    const dispatch = useDispatch()
    const [screenShare, setScreenShare] = useState<Boolean>(false)
    const [col, setcol] = useState<GridSize>(3)
    const [col2, setcol2] = useState<GridSize>(12)
    const classes = useStyles();
    var userClass = classes.userRow

    useEffect(() => {
        registerAgoraEvents()
        if (webrtm.screenShare && webrtm.screenShare.value === "true") {
            setScreenShare(true)
            setcol(12)
            setcol2(2)
        }
        else {
            setScreenShare(false)
            setcol(3)
            setcol2(12)
        }

    }, [])


    function addRemoteUser(data: any) {


        if (data.user.uid.includes('Screen')) {

            const url = window.location.pathname;
            const id = url.substring(url.lastIndexOf('/') + 1);
            if (data.user.uid === `${id}Screen`) {

                return
            }

            if (!screendata[data.user.uid]) {
                let userData = {
                    userId: data.user.uid,
                    elementId: `remote-stream-${data.user.uid}`,
                    name: data.user.uid,
                    isAudioEnabled: false,
                    isVideoEnabled: false,
                    videoStream: null,
                    audioStream: null,
                    volume: null
                }

                screendata[data.user.uid] = userData


            }
            if (data.mediaType === 'audio') {
                screen.audioStream = data.user.audioTrack;
                screen.audioStream.play()
                screen.isAudioEnabled = true
            }
            if (data.mediaType === 'video') {

                if (data.user.uid !== `${id}Screen`) {
                    screendata[data.user.uid].videoStream = data.user.videoTrack;
                    checkElementExistent(screendata[data.user.uid].elementId).then((ele) => {
                        setTimeout(() => {
                            screendata[data.user.uid].videoStream.play(screendata[data.user.uid].elementId)
                        }, 2000);

                    })
                }
                screendata[data.user.uid].isVideoEnabled = true

            }
            setscreen({ ...screendata })

            setScreenShare(true)
            setcol(12)
            setcol2(2)

        }
        else {
            if (!allUser[data.user.uid]) {
                let userData = {
                    userId: data.user.uid,
                    elementId: `remote-stream-${data.user.uid}`,
                    name: data.user.uid,
                    isAudioEnabled: false,
                    isVideoEnabled: false,
                    videoStream: null,
                    audioStream: null,
                    volume: null
                }
                allUser[data.user.uid] = userData;

                webrtm.channel.getMembers()
                    .then((mem: any) => {
                        console.log(typeof (mem[0]), "typeee")
                        dispatch(addmembers(mem))

                    })
                    .catch((err: any) => {
                        console.log(err)

                    })


            }
            if (data.mediaType === 'audio') {
                allUser[data.user.uid].audioStream = data.user.audioTrack;
                allUser[data.user.uid].audioStream.play()
                allUser[data.user.uid].isAudioEnabled = true
            }
            if (data.mediaType === 'video') {

                allUser[data.user.uid].videoStream = data.user.videoTrack;
                allUser[data.user.uid].isVideoEnabled = true
                checkElementExistent(allUser[data.user.uid].elementId).then(() => {
                    setTimeout(() => {
                        allUser[data.user.uid].videoStream.play(allUser[data.user.uid].elementId)
                    }, 2000);

                })


            }

            setallUser({ ...allUser })
        }



    }

    function checkElementExistent(id: any) {
        return new Promise((res, rej) => {
            let ele = document.getElementById(id);
            if (ele) {

                res(ele);
            } else {
                setInterval(() => {

                    let ele = document.getElementById(id);
                    if (ele) {
                        res(ele);
                    }
                }, 100);
            }
        });

    }

    async function removeRemoteUser(data: any) {

        const url = window.location.pathname;
        const useid = url.substring(url.lastIndexOf('/') + 1);
        if (data.user.uid === `${useid}Screen`) {

            return
        }
        let userElement
        if (data.user.uid.includes('Screen')) {
            userElement = screendata[data.user.uid]
        }
        else {
            userElement = allUser[data.user.uid];
        }

        let id = data.user.uid.toString();
        if (data.mediaType === "video") {

            userElement.videoStream = null;
            userElement.isVideoEnabled = false;
        }

        else if (data.mediaType === "audio") {

            userElement.audioStream = null;
            userElement.isAudioEnabled = false;

        }
        if (!userElement.isAudioEnabled && !userElement.isVideoEnabled) {
            document.getElementById(`remote-stream-${id}`)?.remove();
            if (!data.user.uid.includes('Screen')) {
                webrtm.channel.getMembers()
                    .then((mem: any) => {

                        dispatch(addmembers(mem))

                    })
                    .catch((err: any) => {
                        console.log(err)

                    })
            }
            if (data.user.uid.includes('Screen')) {
                delete screendata[data.user.uid]
                setscreen({ ...screendata })
                setScreenShare(false)
                setcol(3)
                setcol2(12)
            }
            else {
                delete allUser[data.user.uid];
                setallUser({ ...allUser })
            }




        }

    }


    async function remoteUserVolume(data: any) {
        try {
            let array = data.evt.sort(data.evt.level).reverse();
            if (array[0].level > 1 && array[0].uid !== userid) {
                const ele = document.getElementById(`remote-stream-${array[0].uid}`)
                if (ele) {
                    ele.style.border = "4px solid blue"
                }

            }

            for (let i = 1; i < array.length; i++) {
                const ele = document.getElementById(`remote-stream-${array[i].uid}`)
                if (ele) {
                    ele.style.border = "none"
                }


            }
        }
        catch (err) {
        }


    }


    function registerAgoraEvents() {
        webrtc.agora.on("Emitter", (data: any) => {
            switch (data.type) {
                case 'user-published': addRemoteUser(data)
                    break;

                case "user-unpublished": removeRemoteUser(data)
                    break;

                case "remoteuser-volume": remoteUserVolume(data)
                    break;

                // case "remoteuser-network": remoteUserNetwork(data)
                //     break;
            }
        })
    }

    {
        screenShare ?
            (
                userClass = classes.userCol
            )
            :
            userClass = classes.userRow
    }

    return (

        <div className={classes.root}>


            <Grid container
                spacing={4} >
                {


                    <>
                        {
                            screenShare ?
                                (

                                    <Grid item md={10} className={classes.screen}>


                                        {

                                            Object.values(screen).map(function (item: any, index: any) {
                                                console.log("true hai screenshare", item)
                                                return (<Grid item xs='auto' md={12} key={index} >

                                                    <CardMedia
                                                        className={classes.screenmedia}

                                                        id={item.elementId}
                                                    />

                                                    <CardContent className={classes.userData}>
                                                        <p>
                                                            {item.name}
                                                        </p>

                                                    </CardContent>


                                                </Grid>)
                                            })


                                        }
                                    </Grid>
                                )
                                :
                                <>
                                </>
                        }

                        <Grid item md={col2} className={userClass}>
                            {
                                Object.values(users).map(function (item: any, index: any) {
                                    {
                                        const url = window.location.pathname;
                                        const id = url.substring(url.lastIndexOf('/') + 1);



                                        return (


                                            <Grid item xs='auto' md={col} key={index} className={classes.card}>

                                                <CardMedia
                                                    className={classes.media}
                                                    image={pic}
                                                    id={item.elementId}
                                                />
                                                <CardContent className={classes.userData}>
                                                    <p>
                                                        {item.name}
                                                    </p>


                                                    <div >

                                                        <MicNoneOutlinedIcon style={{ margin: "1px", padding: "5px" }} />
                                                        <VideocamOutlinedIcon style={{ margin: "1px", padding: "5px" }} />
                                                    </div>
                                                </CardContent>


                                            </Grid>
                                        )

                                    }


                                })
                            }
                        </Grid>
                    </>







                }



            </Grid>


        </div >
    );
}

export default MainWindow;