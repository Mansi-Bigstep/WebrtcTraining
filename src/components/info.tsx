import { users } from '../users'
import { useDispatch, useSelector } from 'react-redux'
import RootState from '../redux/rootState'
import { useEffect } from 'react'
import { addmembers } from '../redux/action'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    users: {
        fontFamily: "bold",
        margin: "1rem"
    }
}));

const Info: React.FC = () => {
    const webrtm = useSelector((state: RootState) => state.agora.rtmobj)
    const members = useSelector((state: RootState) => state.members)
    const dispatch = useDispatch()
    const classes = useStyles();

    function getMembers() {

        webrtm.channel.getMembers()
            .then((mem: any) => {
                console.log(typeof (mem[0]), "typeee")
                dispatch(addmembers(mem))

            })
            .catch((err: any) => {
                console.log(err)

            })

    }

    useEffect(() => {
        getMembers()
    }, [])

    return (
        <div >
            {
                Object.values(members).map(function (item: any, index: any) {
                    return (
                        <div className={classes.users}>
                            {item}
                        </div>
                    )
                })



            }
        </div>
    )
}

export default Info;