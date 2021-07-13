import MainWindow from './remoteUser';
import UserStream from './userStream';
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import SideBar from './sideBar';
import { useParams } from 'react-router-dom';


const useStyles = makeStyles(() => ({
    grid: {
        width: "100%",
        margin: "0px",
        display: "flex",

        alignContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.801)"
    },
    sidebar: {
        backgroundColor: "white",
        borderRadius: "10px",
        height: "52vh",
        marginTop: "1rem"
    },
    btn: {
        backgroundColor: "white",
        border: "none",
        borderRadius: "3px",
        margin: "1rem",
        padding: "0.5rem 1rem",
    },
    window: {

        justifyContent: "center",
        textAlign: "center",

    }
}));

interface ParamTypes {
    userid: string
}

function Main() {
    const classes = useStyles();
    const { userid } = useParams<ParamTypes>()

    const user = {
        name: "Mansi",
        email: "mansigupta@gmail.com",
        id: userid
    }

    return (
        <Grid container spacing={2} className={classes.grid}>
            <Grid item xs={12} md={10} >
                <div className={classes.window}>
                    <MainWindow userid={userid} />
                </div>

            </Grid>
            <Grid item xs={12} md={2} >
                <UserStream {...user} />
                <div className={classes.sidebar}>
                    <SideBar userid={userid} />
                </div>
            </Grid>
        </Grid>

    );
}

export default Main;
