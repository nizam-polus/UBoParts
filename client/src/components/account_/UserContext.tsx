import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import APIs from "~/services/apiService";

interface User {
    user: any;
    saveUser: React.Dispatch<React.SetStateAction<{}>>;
}

const userContext = createContext<User | undefined>(undefined)

interface providerProps {
    children: ReactNode;
}

export function UserProvider(props: providerProps) {

    let userdetails: any = {}
    if (typeof window !== 'undefined') {
        userdetails = localStorage.getItem('userdetails');
        userdetails = JSON.parse(userdetails);
    }

    const [user, setUser] = useState<{}>(userdetails)

    useEffect(() => {
        let userdata: any = localStorage.getItem('userdetails');
        userdata = JSON.parse(userdata);
        if (userdata && userdata.id) {
            APIs.getSpecificUser(userdata.id).then(response => {
                let user = response.data;
                saveUser(user);
                localStorage.setItem('userdetails', JSON.stringify(user));
            })
        }
    }, [])

    const saveUser = (user: any) => {
        setUser(user);
    }

    return <userContext.Provider value={{user, saveUser}}>{props.children}</userContext.Provider>
}

export const UserContext = (): User => {
    const context = useContext(userContext)
    if (context === undefined) {
        throw new Error('UserContext must be used within UserProvider')
    }
    return context;
}