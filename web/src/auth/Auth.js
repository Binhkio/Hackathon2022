import { useContext, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { ref, get, child } from 'firebase/database'
import { firebase } from '../Firebase'

function TokenAvailble() {
  // Check token in local storage
  const token = localStorage.getItem('token')
  console.log('TokenAvailble')
  if (token === null) {
    return <Outlet />
  }
  return <Navigate to="/home-page" />
}

function TokenUnavailble() {
  const token = localStorage.getItem('token')
  console.log('TokenUnavailble')

  if (token === null) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}

export { TokenAvailble, TokenUnavailble }
