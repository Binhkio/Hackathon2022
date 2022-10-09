import { auth } from "../../Firebase"
import './Login.css'
import { GoogleAuthProvider, signInWithPopup, signInWithCredential } from "firebase/auth"
import { ref, set } from "firebase/database"
import { firebase } from "../../Firebase"
import React, { useContext } from "react"
import { AppContext } from "../../context/AppContext"
import { useNavigate } from "react-router-dom"

export const Login = () => {

    const navigate = useNavigate()

    const { handleLogin, setUser } = useContext(AppContext)
    const Gprovider = new GoogleAuthProvider()

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
            const user = {
                accessToken,
                displayName,
                email,
                photoURL,
                uid
            }
            handleLogin(user)
        }).catch(err=>{
            console.log(err)
        })
    }


    const googleLogin = () => signInWithPopup(auth, Gprovider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const access_token = credential.accessToken
            localStorage.setItem('access_token', access_token)
            const {
                accessToken,
                displayName,
                email,
                photoURL,
                uid
            } = auth.currentUser
            const user = {
                accessToken,
                displayName,
                email,
                photoURL,
                uid
            }
            console.log(user)
            handleLogin(user)
            // set(ref(firebase, 'users/' + user.uid), user)
            navigate('/')
        }).catch((error) => {
            console.log(error)
        })

    return (
        <React.Fragment>
            <button
                style={{height:'200%'}}
                onClick={googleLogin}
            >Login with Google</button>
        </React.Fragment>
    )
}