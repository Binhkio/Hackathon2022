import { auth } from "../../Firebase"
import './Login.css'
import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { ref, set } from "firebase/database"
import { firebase } from "../../Firebase"
import { useContext } from "react"
import { AppContext } from "../../context/AppContext"

export const Login = () => {

    const navigate = useNavigate()

    const { setUser } = useContext(AppContext)

    const Gprovider = new GoogleAuthProvider()
    const Fprovider = new FacebookAuthProvider()

    const googleLogin = async () => signInWithPopup(auth, Gprovider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential.accessToken
            localStorage.setItem('token', token)
            // The signed-in user info.
            const user = {
                "info": {
                    "id": result.user.uid,
                    "name": result.user.displayName,
                    "email": result.user.email,
                    "room": null
                }
            }
            setUser(user)
            localStorage.setItem('cur_id', user.info.id)
            set(ref(firebase, 'users/' + user.info.id), user)
            navigate('/home-page')
            // ...
        }).catch((error) => {

    })
    const facebookLogin = async () => signInWithPopup(auth, Fprovider)
        .then((result) => {
        // The signed-in user info.
        const user = result.user;
        console.log(user)
    
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        localStorage.setItem('token', accessToken)
    
        // ...
        })
        .catch((error) => {

        })

        return(
            <div>
            <div  className="background" >  
                <h1 className="title" >日本語を勉強しましょう!!!</h1>
                <button className="withGg" onClick={googleLogin}>Login with Google</button>
            </div>
            </div>
        )
}