import { UserOutlined } from "@ant-design/icons"
import { Avatar } from "antd"
import { get, ref } from "firebase/database"
import { useEffect, useState } from "react"
import { firebase } from "../../Firebase"


export const Player = ({state}) => {

    const [ player, setPlayer ] = useState({})

    useEffect(()=>{
        get(ref(firebase, 'users/' + state.target)).then((snapshot)=>{
            if(snapshot.exists()){
                setPlayer(snapshot.val())
            }else{
                
            }
        })
    }, [])

    return (
        <div
            style={{display:"grid", justifyContent:"center", alignContent:"center"}}
        >
            <Avatar src={player.photoURL} icon={<UserOutlined/>}/>
            <span>{player.displayName}</span>
            <div>
                <span>State</span>
                <span>HP: {state.hp}</span>
                {state.items.shield && <span>Shield: True</span>}
            </div>
        </div>
    )
}