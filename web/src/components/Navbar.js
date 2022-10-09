import React from 'react'
import { Link } from 'react-router-dom'
import { auth } from "../Firebase"
import { signOut } from "firebase/auth"
import './Navbar.css'

export const Navbar = () => {

    return (
        <div
            className = 'main'
            style={{
                
                display: 'flex',
                cursor: 'pointer',
                height: '50px', 
                overflow: 'hidden',
                backgroundColor: 'lightblue'
            }}
        >   
            <div className='content'>
            <img src = 'https://www.reviewofreligions.org/wp-content/uploads/2021/01/samurai-warrior-smalll-shutterstock_1345891196-1024x1024.jpeg'/>
            <h3>Yami no Gemu</h3>
            </div>
            <div className='content'>
            <Link className='link' style={{
                display: 'grid',
                alignContent: 'center',
            }} to={'/home-page'}>Home</Link>

            <Link className='link' style={{
                display: 'grid',
                alignContent: 'center',
            }} to={'/rank'}>Rank</Link>
            <div
                className='link'
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
        </div>
    )
}