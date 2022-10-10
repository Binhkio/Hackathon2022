import { ref, get, child, set, onValue, update } from 'firebase/database'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { firebase } from '../../Firebase'

export const RoomList = () => {
  const navigate = useNavigate()

  const { user } = useContext(AppContext)

  const [roomList, setRoomList] = useState({})

  const handleChooseRoom = (roomId) => {
    get(ref(firebase, 'users/' + user.uid)).then((snapshot)=>{
      if(snapshot.exists()){
        const userDB = snapshot.val()
        if(userDB.current_room === roomId){
          
        }else{
          update(ref(firebase, 'users/' + user.uid), {
            ...userDB,
            current_room: roomId
          })
        }
      }
    }).catch(err=>{console.log(err)})
    get(ref(firebase, 'rooms/' + roomId)).then((snapshot)=>{
      if(snapshot.exists()){
        const room = snapshot.val()
        if(!room.users[user.uid] && room.player < room.max){
          const newPlayer = room.player + 1
          update(ref(firebase, 'rooms/' + roomId), {
            ...room,
            player: newPlayer
          })
          update(ref(firebase, 'rooms/' + roomId + '/users'), {
            ...room.users,
            [user.uid] : true
          })
        }
      }
    }).catch(err=>{console.log(err)})
    navigate(`${roomId}`)
  }

  useEffect(()=>{
    onValue(ref(firebase, 'rooms'), (snapshot) => {
      if(snapshot.exists()){
        setRoomList(snapshot.val())
      }else{
        setRoomList({})
      }
    })
  }, [])
  

  return (
    <React.Fragment>
      {roomList && Object.keys(roomList).map((room) => (
        <div 
          key={roomList[room].id} 
          className="room" 
          onClick={()=>handleChooseRoom(roomList[room].id)}
        >
          <span>Room's master</span>
          {roomList[room].master}
        </div>
      ))}
    </React.Fragment>
  )
}
