import { ref, get, child, set } from "firebase/database"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../context/AppContext"
import { firebase } from "../../Firebase"


export const RoomList = () => {
    const navigate = useNavigate()

    const { user } = useContext(AppContext)

    const [roomList, setRoomList] = useState([])
    
    const handleChooseRoom = async (id) => {
        if(id){
            console.log(id)
            get(child(ref(firebase), 'rooms/' + id)).then((roomInfo) => {
                if(roomInfo.player < 4){
                    const newRoom = {
                        ...roomInfo,
                        player: roomInfo.player + 1,
                        users: {
                            ...roomInfo.users,
                            [user.info.id]: true
                        }
                    }
                    set(ref(firebase, 'rooms/' + id ), newRoom)
                    navigate('/game')
                }
            })
            set(ref(firebase, 'users/' + user.info.id + '/info/room'), id)
        }else{
            alert("Room not found")
        }
    }

    useEffect(()=>{
        get(child(ref(firebase), 'rooms')).then((data)=>{
            if(data.exists()){
                const rooms = data.val()
                const roomsArr = Object.entries(rooms)
                const curRooms = roomsArr.map((val, idx) => (
                    <div key={idx} className="room" onClick={()=>{handleChooseRoom(val[0])}}>
                        {val[1].master}'s room
                    </div>
                ))
                setRoomList(curRooms)
                // const rooms_count = Object.keys(rooms).length
                // if(rooms_count !== roomList.length){
                //     const keys = Object.keys(rooms)
                //     const curRooms = keys.map((val, idx) => (
                //         <div key={idx} className="room" onClick={()=>{handleChooseRoom(rooms[val].id)}}>
                //             {rooms[val].master}'s room
                //         </div>
                //     ))
                //     setRoomList([...roomList, ...curRooms])
                // }
            }else{
                setRoomList(null)
            }
        }).catch(e=>{
            console.log(e)
        })
    },[roomList])

    return (
        <>
            {roomList}
        </>
    )
}