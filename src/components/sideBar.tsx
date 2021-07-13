import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Chat from '../components/chat'
import Info from '../components/info';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';


const useStyles = makeStyles(() => ({

    btn: {
        backgroundColor: "white",
        border: "none",
        borderRadius: "3px",
        margin: "1rem",
        padding: "0.5rem 1rem"
    }
}));


interface Props {
    userid: string,
}

const SideBar: React.FC<Props> = ({ userid }) => {
    const [comp, setcomp] = useState('chat')
    const classes = useStyles();
    return (
        <div >
            <div style={{ textAlign: "center" }}>
                <button className={classes.btn} onClick={() => setcomp('chat')}><ChatOutlinedIcon /></button>
                <button className={classes.btn} onClick={() => setcomp('info')}><PeopleAltOutlinedIcon /> </button>
            </div>

            <hr />
            {

                comp === 'chat' ?
                    (
                        <Chat userid={userid} />
                    ) :
                    (
                        <Info />
                    )
            }
        </div>
    )
}

export default SideBar;