import './style.css'
import { set, ref, get, push } from 'firebase/database'
import { firebase } from '../../Firebase'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { RoomList } from '../../components/RoomList/index.js'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

export const Homepage = () => {
  const navigate = useNavigate()

  const { user } = useContext(AppContext)

  const [ yourRoom, setYourRoom ] = useState("+")

  const handleCreate = () => {
    if(user){
      const gameInfo = {
        "state":{
          "waiting": true,
          "starting": false,
          "ended": false
        },
        "users":{
          [user.uid]: true
        },
        "winner":{
          [user.uid]: false
        },
        "current_turn": 0,
        "turns":{

        },
        "created_at": moment().format('lll')
      }
      const newGameRef = push(ref(firebase, 'games'), gameInfo)
      const newGameKey = newGameRef.key
      const roomInfo = {
          "player": 1,
          "master": user.displayName,
          "id": user.uid,
          "max": 4,
          "current_game": newGameKey,
          "users": {
              [user.uid]: true
          }
      }
      console.log(roomInfo)
      set(ref(firebase, 'rooms/' + user.uid), roomInfo)
      set(ref(firebase, 'users/' + user.uid + '/current_room'), roomInfo.id)
      navigate(`${roomInfo.id}`)
    }
  }

  useEffect(()=>{
    get(ref(firebase, 'rooms/' + user.uid)).then((snapshot)=>{
      if(snapshot.exists()){
        setYourRoom("Your room")
      }
    })
  },[user.uid])

  return (
    <React.Fragment>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
        }}>
        <div className="room create-room" onClick={handleCreate}>
          {yourRoom}
        </div>
        <RoomList />
      </div>
    </React.Fragment>
  )
}
