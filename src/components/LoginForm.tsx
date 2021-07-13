
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUserDetails } from '../redux/action';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import RootState from '../redux/rootState'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'white'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),

    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    text: {
        color: "white"
    }
}));

export default function LoginForm() {
    const classes = useStyles();
    const [name, setname] = useState<String>('')
    const [email, setemail] = useState<String>('')
    // const [channelId, setchannelId] = useState<String>('')
    const dispatch = useDispatch()
    const history = useHistory()
    const webrtm = useSelector((state: RootState) => state.agora.rtmobj)

    function onSubmitHandler(e: any) {
        e.preventDefault()
        dispatch(addUserDetails(name, email))

        webrtm.initRTMSession(name)
        history.push(`/videocall/${name}`)

    }


    function onEmailChangeHandler(event: any) {
        setemail(event.target.value)
    }

    function onNameChangeHandler(event: any) {
        setname(event.target.value)
    }

    // function onChannelIdChangeHandler(event: any) {
    //     setchannelId(event.target.value)
    // }


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Enter details
                </Typography>
                <form className={classes.form} onSubmit={(e) => onSubmitHandler(e)}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={onEmailChangeHandler}

                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="name"
                        label="name"
                        type="name"
                        id="name"
                        autoComplete="name"
                        onChange={onNameChangeHandler}
                    />
                    {/* <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="Channel Name"
                        label="Channel Name"
                        type="Channel Name"
                        id="Channel Name"
                        autoComplete="Channel Name"
                        onChange={onChannelIdChangeHandler}
                    /> */}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Enter
                    </Button>

                </form>
            </div>

        </Container>
    );
}