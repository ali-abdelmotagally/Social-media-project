import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({children}){

    const [userToken, setUserToken] = useState( function(){
        return localStorage.getItem("userToken") //perform this function ONLY ONCE then store its value (return), so it doesn't have to render on every refresh.
    })
    return (
        <AuthContext.Provider value = {{userToken, setUserToken}}>
           {children}
        </AuthContext.Provider>
    )
}