// utils/withAuth.js

import { useEffect } from 'react';
import { checkAuthentication } from './auth';
import { useRouter } from 'next/router';

export function withAuth(WrappedComponent) {
  return (props) => {
    const isAuthenticated = checkAuthentication();
    const router = useRouter();
    // console.log(window)
    useEffect(() =>{
      if (!isAuthenticated) {
       router.push("/homepage") // Redirect to the login page if not authenticated
        return
      }
    },[])

    return isAuthenticated ? <WrappedComponent {...props} /> : <>Loading...</>;
  };
}
