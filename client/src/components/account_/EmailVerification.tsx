import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function EmailVerification() {

    const router: any = useRouter();
    const username = router.query.username;
    const key = router.query.key;

    const [timer, setTimer] = useState(5);

    useEffect(() => {
        setTimeout(() => {
            router.push({pathname: '/homepage', query: {emailVerified: true, username: username}})
        }, 5000)        
    }, [])

    // useEffect(() => {
    //     let timerTick = setInterval(() => {
    //         if (timer <= 0) {
    //             clearInterval(timerTick)
    //         } else {
    //             // console.log(timer)
    //             timer && setTimer(timer - 1);
    //         }            
    //     }, 1000)
    // }, [timer])

    return (
        <>
            <div style={{textAlign: 'center', position: 'relative', marginTop: '10%'}}>
                <i className="fa fa-check-circle" style={{fontSize: '4rem', color: '#587E50'}}></i>
                <p className="body-sub-titles-1 regularfont mt-2">Email verified successfully</p>
                <p className="body-sub-titles-2 regularfont m-0">You will be redirected to Login page shortly</p>
                {/* <p id="ticker">{timer}</p> */}
            </div>
        </>
    )

}

export default EmailVerification;