import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { Homepage } from './pages/Homepage'
import { AppContextProvider } from './context/AppContext'
import { Game } from './pages/Game'
import Room from './pages/Room'

function App() {
  return (
    <AppContextProvider>
      <Routes>
        {/* Inside */}
        <Route path="/" element={<Homepage />} />
        <Route path=":roomId" element={<Room />}>
          <Route path=":gameId" element={<Game />} />
        </Route>

        {/* Outside */}
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </AppContextProvider>
  )
}

export default App
