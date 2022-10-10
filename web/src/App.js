import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { Homepage } from './pages/Homepage'
import { Game } from './pages/Game'
import Room from './pages/Room'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <Routes>
      {/* Inside */}
      <Route path="/" element={<Navbar />}>
        <Route path="rooms" element={<Homepage />} />
        <Route path="rooms/:roomId" element={<Room />} />
      </Route>

      {/* Outside */}
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Login />} />
    </Routes>
  )
}

export default App
