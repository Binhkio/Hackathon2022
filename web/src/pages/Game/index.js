import {
  ref,
  child,
  onValue,
  update,
  remove,
  set,
  push,
  get,
} from 'firebase/database'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { firebase } from '../../Firebase'
import './style.css'

export const Game = () => {
  const navigate = useNavigate()

  const [started, setStarted] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [questions, setQuestions] = useState({})
  const [yourTurn, setYourTurn] = useState(false)
  const [correctAns, setCorrectAns] = useState(false)
  var loser = 0
  const userID = localStorage.getItem('cur_id')

  const [gameForm, setGameForm] = useState({})

  const [turnForm, setTurnForm] = useState({})

  useEffect(() => {
    get(child(ref(firebase), 'questions')).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        setQuestions(data[turnForm.question_id])
      }
    })

    get(child(ref(firebase), 'games/test')).then((snapshot) => {
      if (snapshot.exists()) {
        const gameData = snapshot.val()
        setGameForm(gameData)
      }
    })

    const userIdArray = Object.keys(gameForm.users ? gameForm.users : {})
    if (
      userIdArray.indexOf(userID) ===
      gameForm.cur_turn % userIdArray.length
    ) {
      // Answer question
      setYourTurn(true)
      setTimeout(() => {
        if (!answered) {
          const lastState = gameForm?.turns[`${gameForm.cur_turn}`].state
            ? gameForm.turns[`${gameForm.cur_turn}`].state
            : {
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
              }
          setTurnForm({
            question_id: `${Math.floor(Math.random() * 110)}`,
            state: {
              ...[lastState],
              [userID]: {
                hp: lastState[userID].hp - 10,
                item: {
                  shield: false,
                },
              },
            },
            target: userID,
          })
        }
      }, 30000)
      // Answered
      if (answered && !correctAns) {
        const lastState = gameForm.turns
          ? gameForm.turns[`${gameForm.cur_turn}`].state
          : {
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
            }
        setTurnForm({
          question_id: `${Math.floor(Math.random() * 110)}`,
          state: {
            ...[lastState],
            [userID]: {
              hp: lastState[userID].hp - 10,
              item: {
                shield: false,
              },
            },
          },
          target: userID,
        })
      }
      if (correctAns) {
        const lastState = gameForm.turns[`${gameForm.cur_turn}`].state
        const stateID = Object.keys(lastState)
        stateID.forEach((key, idx) => {
          if (key !== userID) {
            setTurnForm({
              question_id: `${Math.floor(Math.random() * 110)}`,
              state: {
                ...[lastState],
                [key]: {
                  hp: lastState[key].hp - 20,
                  item: {
                    shield: false,
                  },
                },
              },
              target: userID,
            })
          }
        })
      }

      const newTurn = gameForm.cur_turn + 1
      const updates = {}
      updates[`games/test/cur_turn`] = newTurn
      update(ref(firebase, `games/test`), updates)
      set(ref(firebase, `games/test/turns/${newTurn}`), turnForm)
      console.log('re-render')
    }
  }, [])

  const handleLeave = () => {
    get(child(ref(firebase), 'rooms/default')).then((snapshot) => {
      const rooms = snapshot.val()
      if (rooms.player === 1) {
        remove(ref(firebase, 'rooms'))
        remove(ref(firebase, 'games'))
      } else {
        update(ref(firebase, 'rooms/default'), {
          player: rooms.player - 1,
          users: {
            ...rooms.users,
            [userID]: null,
          },
        })
      }
    })
    navigate('/home-page')
  }

  const handleStartGame = () => {
    get(child(ref(firebase), 'games/test')).then((snapshot) => {
      const gameData = snapshot.val()
      set(ref(firebase, 'games/test'), {
        ...gameData,
        start: true,
      })
    })
  }

  const handleAnswer = (ans) => {
    // const curTurn = gameForm.cur_turn
    // const quesId = gameForm.turns[`${curTurn}`].question
    // const quesRef = ref(firebase, 'questions')
    const correct_ans = questions?.correct_answer
    if (ans === correct_ans) {
      setCorrectAns(true)
    } else {
    }
    setAnswered(true)
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'right', width: '100vw' }}>
        <button onClick={handleLeave}>Leave</button>
      </div>
      <div className="line">
        {gameForm &&
          Object.keys(gameForm.users ? gameForm.users : {}).map((key, idx) => {
            console.log(key, idx)
            return (
              <div className="player" key={idx}>
                <div className="name">Player 1</div>
                <div className="hp">
                  {turnForm?.state && turnForm?.state[key]?.hp} HP
                </div>
              </div>
            )
          })}
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
  )
}
