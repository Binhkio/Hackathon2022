import { get, onValue, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { firebase } from '../../Firebase'

export default function Room() {
  const [userList, setUserList] = useState([])

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
      }
    })
  }, [roomId])

  if (!userList) {
    return <div>Loading</div>
  }

  return (
    <React.Fragment>
      
    </React.Fragment>
  )
}
