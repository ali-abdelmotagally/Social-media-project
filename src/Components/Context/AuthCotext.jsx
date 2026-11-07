import { createContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"

export const AuthContext = createContext();

export function AuthProvider({children}){

    const [userToken, setUserToken] = useState( function(){
        return localStorage.getItem("userToken") //perform this function ONLY ONCE then store its value (return), so it doesn't have to render on every refresh.
    })
    const [userID, setUserID] = useState(null)

useEffect(() => {
    if (userToken) {
        const {user} = jwtDecode(userToken);

        console.log(userToken);
        setUserID(user)
    }
}, [userToken]);
   

    return (
       <AuthContext.Provider value={{ userToken, setUserToken, userID }}>
        {children}
    </AuthContext.Provider>
    )
}