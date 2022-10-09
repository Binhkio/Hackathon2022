import { createContext, useState } from "react"
import { set, ref, get, child } from "firebase/database"
import { firebase } from "../Firebase"

export const AppContext = createContext()

export const AppContextProvider = ({children}) => {
    
    const [user, setUser] = useState({})

    const contextData = {
        user,
        setUser,
    }

    return (
        <AppContext.Provider value={contextData}>
            {children}
        </AppContext.Provider>
    )
}