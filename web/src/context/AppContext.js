import { createContext, useEffect, useState } from "react"
import { auth, firebase } from "../Firebase"
import { reauthenticateWithCredential, signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth"
import { ref, set } from "firebase/database"
import moment from "moment"

export const AppContext = createContext()

export const AppContextProvider = ({children}) => {

    const navigate = useNavigate()

    const [user, setUser] = useState({})

    auth.onAuthStateChanged((userAuth) => {
        if(!userAuth){
            setUser(null)
        }
    })

    console.log(user)
    
    useEffect(()=>{
        const access_token = localStorage.getItem('access_token')
        if(access_token){
            console.log('has access token')
            const credential = GoogleAuthProvider.credential(null, access_token)
            signInWithCredential(auth, credential).then((userCredential)=>{
                const {
                    accessToken,
                    displayName,
                    email,
                    photoURL,
                    uid
                } = userCredential.user
                const userLogin = {
                    accessToken,
                    displayName,
                    email,
                    photoURL,
                    uid
                }

                if(window.location.pathname === '/login')
                    handleLogin(userLogin)
                else
                    setUser(userLogin)

            }).catch(err=>{
                console.log('auth fail',err)
            })
        }else{
            navigate('/login')
        }
    },[])
    
    const handleLogout = () => {
        localStorage.removeItem('access_token')
        signOut(auth)
        setUser(null)
        navigate('/login')
    }

    const handleLogin = (userLogin) => {
        setUser(userLogin)
        set(ref(firebase, 'users/' + userLogin.uid), userLogin).then(()=>{
            navigate('/rooms')
        })
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