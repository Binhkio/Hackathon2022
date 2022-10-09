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
      <>
        <div
          style={{ display: 'flex', justifyContent: 'right', width: '100vw' }}>
          <button>Leave</button>
        </div>
        <div className="line">
          {gameForm &&
            Object.keys(gameForm.users ? gameForm.users : {}).map(
              (key, idx) => {
                console.log(key, idx)
                return (
                  <div className="player" key={idx}>
                    <div className="name">Player 1</div>
                    <div className="hp">
                      {turnForm?.state && turnForm?.state[key]?.hp} HP
                    </div>
                  </div>
                )
              }
            )}
        </div>
        <div>
          <button disabled={started} onClick={handleStartGame}>
            Start
          </button>
        </div>
        {yourTurn && (
          <div className="question">
            <div className="content">{questions && questions.content}</div>
            <div className="answers">
              <div id="ans-1" onClick={handleAnswer('1')}>
                A. {questions?.answer && questions.answers[1]}
              </div>
              <div id="ans-2" onClick={handleAnswer('2')}>
                B. {questions?.answer && questions.answers[2]}
              </div>
              <div id="ans-3" onClick={handleAnswer('3')}>
                C. {questions?.answer && questions.answers[3]}
              </div>
              <div id="ans-4" onClick={handleAnswer('4')}>
                D. {questions?.answer && questions.answers[4]}
              </div>
            </div>
          </div>
        )}
        <div className="line">
          <div className="user">
            <div className="name">You</div>
            <div className="hp">
              {turnForm?.state && turnForm.state[`${userID}`].hp} HP
            </div>
          </div>
        </div>
      </>
    </React.Fragment>
  )
}
