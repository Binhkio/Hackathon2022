import { Navbar } from '../../components/Navbar'
import './style.css'
import { set, ref, get, child, onValue, update } from 'firebase/database'
import { firebase } from '../../Firebase'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { RoomList } from '../../components/RoomList/index.js'
import { useNavigate } from 'react-router-dom'

export const Homepage = () => {
  const navigate = useNavigate()

  // const handleCreate = async () => {
  //     if(userID){
  //         const roomInfo = {
  //             "state": "stand_by",
  //             "player": 1,
  //             "master": user.info.name,
  //             "id": userID,
  //             "max": 4,
  //             "users": {
  //                 [userID]: true
  //             }
  //         }
  //         console.log(userID)
  //         set(ref(firebase, 'rooms/' + userID), roomInfo)
  //         set(ref(firebase, 'users/' + userID + '/info/room'), roomInfo.id)
  //         navigate('/game')
  //     }
  //     else
  //         console.log("ID not found")
  // }

  const handleJoin = (e) => {
    e.preventDefault()
    const userID = localStorage.getItem('cur_id')
    const starCountRef = ref(firebase, 'rooms/default')
    onValue(
      starCountRef,
      (data) => {
        if (data.exists()) {
          const room = data.val()
          update(ref(firebase, 'rooms/default'), {
            player: room.player + 1,
            users: {
              ...room.users,
              [userID]: true,
            },
          })

          update(ref(firebase, 'games/test/users'), { [userID]: true })

          console.log(room)
        } else {
          set(ref(firebase, 'rooms/default'), {
            player: 1,
            users: {
              [userID]: true,
            },
          })
          set(ref(firebase, 'games/test'), {
            start: false,
            users: {
              [userID]: true,
            },
            winner: {},
            cur_turn: 0,
            turns: {
              1: {
                question_id: `${Math.floor(Math.random() * 110)}`,
                state: {
                  [userID]: {
                    hp: 100,
                    item: {
                      shield: false,
                    },
                  },
                },
                target: userID,
              },
            },
          })
          console.log('err')
        }
      },
      {
        onlyOnce: true,
      }
    )
    navigate('/default')
    // get(child(ref(firebase), 'rooms/default')).then((room) => {
    //     set(ref(firebase, 'rooms/default'), {
    //         ...room,
    //         users: {
    //             ...room.users,
    //             [user.info.id]: true
    //         }
    //     })
    //     console.log(room)
    //     navigate('/game')
    // }).catch((err)=>{
    //     set(ref(firebase, 'rooms/default'), {
    //         player: 1,
    //         state: "stand_by",
    //         users: {
    //             [user.info.id]: true
    //         }
    //     })
    //     console.log('err', err)
    //     navigate('/game')
    // })
  }

  return (
    <React.Fragment>
      <Navbar/>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
        }}>
        <div className="room create-room" onClick={handleJoin}>
          Default room
        </div>
        {/* <RoomList /> */}
      </div>
    </React.Fragment>
  )
}
