import { createContext, useEffect, useState } from "react"
import { auth } from "../Firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"

export const AppContext = createContext()

export const AppContextProvider = ({children}) => {

    const navigate = useNavigate()

    const [user, setUser] = useState({})

    auth.onAuthStateChanged((userAuth) => {
        if(userAuth){
            setUser(userAuth)
        }
        else{
            setUser(null)
        }
    })

    useEffect(()=>{
        if(!user){
            navigate('/login')
        }
    },[user])
    
    const handleLogout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('id_token')
        signOut(auth)
        setUser(null)
        navigate('/login')
    }

    const handleLogin = (userLogin) => {
        setUser(userLogin)
        navigate('/')
    }

    const contextData = {
        user,
        setUser,
        handleLogout,
        handleLogin
    }

    return (
        <AppContext.Provider value={contextData}>
            {children}
        </AppContext.Provider>
    )
}