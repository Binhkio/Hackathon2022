import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { Homepage } from './pages/Homepage'
import { TokenAvailble, TokenUnavailble } from './auth/Auth'
import { AppContextProvider } from './context/AppContext'
import { Game } from './pages/Game'
import Room from './pages/Room'

function App() {
  return (
    <AppContextProvider>
      <Routes>
        <Route element={<TokenAvailble />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<TokenUnavailble />}>
          <Route path="/home-page" element={<Homepage />} />
          <Route path=":roomId" element={<Room />}>
            <Route path=":gameId" element={<Game />} />
          </Route>
        </Route>
      </Routes>
    </AppContextProvider>
  )
}

export default App
