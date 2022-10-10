import { get, onValue, ref, remove, update } from 'firebase/database'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RoomList } from '../../components/RoomList'
import { AppContext } from '../../context/AppContext'
import { firebase } from '../../Firebase'

export default function Room() {
  const [userList, setUserList] = useState([])
  const navigate = useNavigate()

  const { user } = useContext(AppContext)

  const { roomId } = useParams()
  console.log(userList)
  useEffect(() => {
    onValue(ref(firebase, `rooms/${roomId}`), (snapshot) => {
      if (snapshot.exists()) {
        const userIdList = Object.keys(snapshot.val().users)
        const userInfoListPromise = userIdList.map(async (id) => {
          const userInfo = await get(ref(firebase, `users/${id}`))
          return userInfo.val()
        })
        ;(async () => {
          const userInfoList = await Promise.all(userInfoListPromise)
          setUserList(userInfoList)
        })()
      }else{
        update(ref(firebase, `users/${user.uid}`), {
          ...user,
          current_room: null
        })
        navigate('/rooms')
      }
    })
  }, [roomId])

  const handleLeave = () => {
    console.log('handle leave')
    if(user.uid === roomId){
      remove(ref(firebase, 'rooms/' + roomId))
    }else{
      get(ref(firebase, 'rooms/' + roomId)).then((snapshot)=>{
        if(snapshot.exists()){
          const room = snapshot.val()
          update(ref(firebase, 'rooms/' + roomId), {
            ...room,
            player: room.player - 1,
            users: {
              ...room.users,
              [user.uid]: null
            }
          })
        }
      })
    }
    remove(ref(firebase, 'users/' + user.uid + '/current_room'))
    navigate('/rooms')
  }
  return (
    <React.Fragment>
      <button onClick={handleLeave}>Leave room</button>
      <h1>Game play field</h1>
      {userList && userList.map((user, idx) => (
        <div key={user.uid}>Player {idx+1}:  {user.displayName}</div>
      ))}
    </React.Fragment>
  )
}
