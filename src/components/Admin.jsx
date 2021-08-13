import React from 'react'
import { withRouter } from "react-router-dom";
import {auth} from '../firebase'
import Firestore from './Firestore';

const Admin = (props) => {

    const [user, setUser] = React.useState(null)

    React.useEffect(() => {
        if(auth.currentUser){
            console.log('existe')
            setUser(auth.currentUser)
        }else{
            console.log('no existe')
            props.history.push('/login')
        }
    }, [props.history])


    return (
        <div className="mt-5">
            <h3 className="text-center">Ruta protegida</h3>
            {
                user && (
                    <Firestore user={user} />
                )
            }
        </div>
    )
}

export default withRouter(Admin)
