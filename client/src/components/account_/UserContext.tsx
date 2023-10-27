import { useRouter } from "next/router";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import APIs from "~/services/apiService";

interface User {
    user: any
    saveUser: React.Dispatch<React.SetStateAction<{}>>
    cartCount: number
    setCartCount: React.Dispatch<React.SetStateAction<number>>
    logout: React.Dispatch<void>
    language: any
    setLanguage: React.Dispatch<React.SetStateAction<{}>>
    paymentStatus: any
    setPaymentStatus: React.Dispatch<React.SetStateAction<string>>
}

const userContext = createContext<User | undefined>(undefined)

interface providerProps {
    children: ReactNode;
}

export function UserProvider(props: providerProps) {

    const router = useRouter();

    let userdetails: any = {}
    if (typeof window !== 'undefined') {
        userdetails = localStorage.getItem('userdetails');
        userdetails = JSON.parse(userdetails);
    }

    const [user, setUser] = useState<any>(userdetails || {});
    const [cartCount, setCartCount] = useState<number>(0);
    const [language, setLanguage] = useState<any>({});
    const [paymentStatus, setPaymentStatus] = useState<any>('');

    useEffect(() => {
        if (new Date(user?.expiry_date) < new Date()) {
            logout();
        }
    })

    useEffect(() => {
        let userdata: any = localStorage.getItem('userdetails');
        let transactionId: any = localStorage.getItem('uid') || '';
        userdata = JSON.parse(userdata);
        if (new Date(userdata?.expiry_date) < new Date()) {
            userdata = {};
            logout();
        } else if (userdata && userdata.id) {
            APIs.getSpecificUser(userdata.id).then(response => {
                let user = response.data;
                saveUser(user);
                localStorage.setItem('userdetails', JSON.stringify(user));
            });
            APIs.getCartData({customerid: userdata.id}).then(response => {
                if (!response.data.error) {
                    let totalCartItem = response.data.rows.length;
                    setCartCount(totalCartItem);
                }
            }).catch((error) => console.log(error));
        }
        transactionId && APIs.paymentStatus(transactionId, user.id).then(response => {
            let status = response?.data?.rows?.length ? response.data.rows[0].status : 'failed';
            setPaymentStatus(status);
        })
    }, [])

    const saveUser = (user: any) => {
        setUser(user);
    }

    const logout = () => {
        localStorage.removeItem('usertoken');
        router.push('/homepage');
        localStorage.removeItem('userdetails');
        saveUser({});
    }
    
    return <userContext.Provider value={{user, saveUser, cartCount, setCartCount, logout, language, setLanguage, paymentStatus, setPaymentStatus}}>{props.children}</userContext.Provider>
}

export const UserContext = (): User => {
    const context = useContext(userContext)
    if (context === undefined) {
        throw new Error('UserContext must be used within UserProvider')
    }
    return context;
}