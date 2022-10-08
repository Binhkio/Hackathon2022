import { Navbar } from "../../components/Navbar"
import './style.css'
import { set, ref, get, child } from "firebase/database"
import { firebase } from "../../Firebase"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../context/AppContext"

export const Homepage = () => {

    const { user, setUser } = useContext(AppContext)
    const [ rooms, setRooms ] = useState({})
    console.log(user)
    const userID = user ? localStorage.getItem('cur_id') : user.info.id
    console.log(userID)
    
    const getRooms = async () => {
        get(child(ref(firebase), 'rooms')).then((data)=>{
            if(data.exists()){
                console.log(data.val())
                setRooms(data.val())
            }else{
                console.log('nothing')
            }
        }).catch(e=>{
            console.log(e)
        })
    }

    useEffect(()=>{
        const id = localStorage.getItem('cur_id')
        get(child(ref(firebase), `users/${id}`)).then((userData)=>{
            if(userData.exists()){
                setUser(userData.val())
            }
        }).catch((e)=>{
            console.log(e)
        })
        getRooms()
    },[])


    const handleCreate = async () => {
        if(userID)
            set(ref(firebase, 'rooms/' + userID), {
                "state": "stand_by",
                "player": 1,
                "max": 4,
                "users": {
                    [userID]: true
                }
            })
        else
            console.log("ID not found")
    }


    useEffect(()=>{
    },[])

    return (
        <>
            <Navbar/>
            <div style={{
                display: "flex",
                justifyContent: "space-around"
            }}>
                <div className="room create-room" onClick={handleCreate}>
                    +
                </div>
                <div className="room">
                    Room 1
                </div>
                <div className="room">
                    Room 2
                </div>
                <div className="room">
                    Room 3
                </div>
                <div className="room">
                    Room 4
                </div>
                <div className="room">
                    Room 5
                </div>
            </div>
        </>
    )
}