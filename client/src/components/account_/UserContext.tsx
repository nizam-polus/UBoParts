import { ReactNode, createContext, useContext, useState } from "react";

interface User {
    user: any;
    saveUser: React.Dispatch<React.SetStateAction<{}>>;
}

const user_Context = createContext<User | undefined>(undefined)

interface providerProps {
    children: ReactNode;
}

export function UserProvider(props: providerProps) {

    const [user, setUser] = useState<{}>({})

    const saveUser = (user: any) => {
        setUser(user) 
    }

    return <user_Context.Provider value={{user, saveUser}}>{props.children}</user_Context.Provider>
}

export const UserContext = (): User => {
    const context = useContext(user_Context)
    if (context === undefined) {
        throw new Error('UserContext must be used within UserProvider')
    }
    return context;
}