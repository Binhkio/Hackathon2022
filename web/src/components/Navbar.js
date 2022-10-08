import React from 'react'
import { Link } from 'react-router-dom'
import { auth } from "../Firebase"
import { signOut } from "firebase/auth"

export const Navbar = () => {

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-around',
                cursor: 'pointer',
                height: '50px'
            }}
        >
            <Link style={{
                display: 'grid',
                alignContent: 'center',
            }} to={'/home-page'}>Home</Link>

            <Link style={{
                display: 'grid',
                alignContent: 'center',
            }} to={'/rank'}>Rank</Link>
            <div
                style={{
                    display: 'grid',
                    alignContent: 'center',
                }}
                onClick={()=>{
                    signOut(auth)
                    localStorage.removeItem('token')
                    window.location.reload()
                }}
            >
                Logout
            </div>
        </div>
    )
}