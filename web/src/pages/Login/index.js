import { auth } from "../../Firebase"
import './Login.css'
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import React, { useContext } from "react"
import { AppContext } from "../../context/AppContext"

export const Login = () => {

    const { handleLogin, setUser } = useContext(AppContext)
    const Gprovider = new GoogleAuthProvider()

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