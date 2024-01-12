import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";

function paymentFailed() {
   
    const router = useRouter()

    useEffect(() => {
        setTimeout(() => {
            router.push("/homepage")
        },5000)
    })

    // setTimeout(() => {
    //     router.push({ pathname: '/homepage', query: { emailVerified: true, username: username } });
    // }, 1500);

    return (
        <>
            <div style={{ textAlign: 'center', position: 'relative', margin: '10%' }}>
                <i className="fas fa-exclamation-triangle" style={{ fontSize: '4rem', color: 'red' }}></i>
                <p className="body-sub-titles-1 semifont mt-2" style={{fontSize: "2rem"}}>
                    <FormattedMessage id="PAYMENT_FAILED" />
                </p>
                <p className="body-sub-titles-2 regularfont m-0">
                    <FormattedMessage id="REDIRECT_HOME" />
                </p>
            </div>
        </>
    )

}

export default paymentFailed;