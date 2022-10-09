import React, { useState, useEffect } from 'react'
import audios from "../audios";
import './MultiPlayer.css';

var random_id = Math.floor(Math.random() * 2);
console.log(random_id)
var urls = [audios[random_id].src];
console.log(audios);
const useMultiAudio = urls => {
  const [sources] = useState(
    urls.map(url => {
      return {
        url,
        audio: new Audio(url),
      }
    }),
  )

  const [players, setPlayers] = useState(
    urls.map(url => {
      return {
        url,
        playing: false,
      }
    }),
  )
 
  const toggle = targetIndex => () => {
    const newPlayers = [...players]
    const currentIndex = players.findIndex(p => p.playing === true)
    if (currentIndex !== -1 && currentIndex !== targetIndex) {
      newPlayers[currentIndex].playing = false
      newPlayers[targetIndex].playing = true
    } else if (currentIndex !== -1) {
      newPlayers[targetIndex].playing = false
    } else {
      newPlayers[targetIndex].playing = true
    }
    setPlayers(newPlayers)
  }
 
  useEffect(() => {
    sources.forEach((source, i) => {
      players[i].playing ? source.audio.play() : source.audio.pause()
    })
  }, [sources, players])
 
  useEffect(() => {
    sources.forEach((source, i) => {
      source.audio.addEventListener('ended', () => {
        const newPlayers = [...players]
        newPlayers[i].playing = false
        setPlayers(newPlayers)
      })
    })
    return () => {
      sources.forEach((source, i) => {
        source.audio.removeEventListener('ended', () => {
          const newPlayers = [...players]
          newPlayers[i].playing = false
          setPlayers(newPlayers)
        })
      })
    }
  }, [])
 
  return [players, toggle]
}
 
const MultiPlayer = () => {
  const [players, toggle] = useMultiAudio(urls)
 
  return (
    <div>
      {players.map((player, i) => (
        <Player key={i} player={player} toggle={toggle(i)} />
      ))}
    </div>
  )
}



const Player = ({ player, toggle }) => (
  
    <div class="player">
        <ul>
            <li class="cover"  ><img src={audios[random_id].avartar} />
            </li>
            <div className="info">
                <h1>{audios[random_id].author}</h1>
                <h4>{audios[random_id].movie}</h4>
                <h2>{audios[random_id].title}</h2>
                <h2>{audios[random_id].vietnamese}</h2>
                <button className='button' onClick={toggle}>{player.playing ? 'Pause' : 'Play Sound'}</button>
            </div>
            
        </ul>
    
    
  </div>
)
 
 
export default MultiPlayer