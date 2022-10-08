import { get, set, ref } from "firebase/database"
import { firebase } from "../../Firebase"

export const Homepage = () => {

    

    return (
        <>
        <div className="line">
            <div className="player-1">
                <div className="name"></div>
                <div className="hp">100</div>
            </div>
        </div>
        <div className="line">
            <div className="player-2">
                <div className="name"></div>
                <div className="hp">100</div>
            </div>
            <div className="player-3">
                <div className="name"></div>
                <div className="hp">100</div>
            </div>
        </div>
        <div className="line">
            <div className="user">
                <div className="name"></div>
                <div className="hp">100</div>
            </div>
        </div>
        </>
    )
}