import { Button } from "antd"
import { get, onValue, ref, update } from "firebase/database"
import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AppContext } from "../../context/AppContext"
import { firebase } from "../../Firebase"


export const Game = () => {

  const { user } = useContext(AppContext)

  const [ gameId, setGameId ] = useState('')
  const [ curGame, setCurGame ] = useState({})
  const [ questions, setQuestions ] = useState({})
  const defaultState = {
    "hp": 100,
    "items": {
      "shield": false
    },
    "hasAttacked": function(){
      this.hp = this.hp - 20
    }
  }
  const [ newState, setNewState ] = useState({})

  const {roomId} = useParams()

  const initFirstTurn = (gameId) => {
    get(ref(firebase, 'games/' + gameId + '/users')).then((gameSnapshot)=>{
      if(gameSnapshot.exists()){
        const playerList = Object.keys(gameSnapshot.val())
        let totalState = {}
        playerList.forEach((player)=>{
          console.log('player:', player)
          totalState = {
            ...totalState,
            [player]: defaultState
          }
        })
        
        update(ref(firebase, 'games/' + gameId), 
        {
          ...curGame,
          "current_turn": 1,
          "turns": {
            "1": {
              "question": `${Math.floor(Math.random() * Object.keys(questions).length)}`,
              "state": {...totalState},
              "target": user.uid
            }
          }
        }).then(()=>{
          setCurGame({
            ...curGame,
            "current_turn": 1,
            "turns": {
              "1": {
                "question": `${Math.floor(Math.random() * Object.keys(questions).length)}`,
                "state": {...totalState},
                "target": user.uid
              }
            }
          })
        })
        console.log("curGame: ", curGame)
      }
    })
  }

  const handleStart = (e) => {
    e.preventDefault()
    get(ref(firebase, 'rooms/' + roomId + '/current_game')).then((roomSnapshot)=>{
      if(roomSnapshot.exists()){
        update(ref(firebase, 'games/' + roomSnapshot.val() + '/state'), {
          "waiting": false,
          "started": true,
          "ended": false
        })
        initFirstTurn(roomSnapshot.val())
      }else{
        console.log('No room exist')
      }
    })
  }

  useEffect(()=>{
    get(ref(firebase, 'questions')).then((quesSnapshot)=>{
      if(quesSnapshot.exists()){
        setQuestions(quesSnapshot.val())
      }else{
        console.log('No question exist')
      }
    })
    onValue(ref(firebase, `rooms/${roomId}/current_game`), (roomSnapshot) => {
      if(roomSnapshot.exists()){
        onValue(ref(firebase, `games/${roomSnapshot.val()}`), (gameSnapshot) => {
          if(gameSnapshot.exists()){
            console.log('game info', gameSnapshot.val())
            setCurGame(gameSnapshot.val())
          }else{
            // ...
          }
        })
      }else{
        // ...
      }
    })
  }, [])

  return (
    <React.Fragment>
      <h1>Game play field</h1>
      {(roomId === user.uid) && 
        <Button  onClick={handleStart}>Start game</Button>
      }
      {/* {(curGame && curGame.turns[curGame.current_turn].target === user.uid)
      &&
        <div>
          Your Question:
          <div>{curGame.turns[curGame.current_turn].question.content}</div>
          {['A','B','C','D'].map((val, idx)=>(
            <div>`${val}`{curGame.turns[curGame.current_turn].question.answers[idx+1]}</div>
          ))}
        </div>
      } */}
    </React.Fragment>
  )
}