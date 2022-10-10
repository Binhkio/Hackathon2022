import React, { useContext, useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Row, Col } from 'antd'
import { auth } from "../Firebase"
import { AppContext } from '../context/AppContext'

export const Navbar = () => {

    const { handleLogout } = useContext(AppContext)

    const navigate = useNavigate()
    useEffect(()=>{
        if(window.location.pathname === '/'){
            navigate('/rooms')
        }
    }, [])
    
    return (
        <React.Fragment>

            <Row justify="center" align="middle">
                <Col span={8}></Col>
                <Col span={6}></Col>
                <Col span={6}></Col>
                <Col 
                    span={4}
                    onClick={()=>{
                        console.log('Log out')
                        handleLogout()
                    }}
                    >
                    <Link>Logout</Link>
                </Col>
            </Row>
            <Outlet/>
        </React.Fragment>
    )
}