import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import APIs from "~/services/apiService";

function EmailVerification() {

    const router: any = useRouter();
    const username = router.query.username;
    const key = router.query.key;

    const [timer, setTimer] = useState(5);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        let userData = {
            user_name: username,
            verifyKey: key
        };
        APIs.verifyUser(userData).then((response: any) => {
            let verified = response.data.verified;
            if (verified) {
                setVerified(verified);
                setTimeout(() => {
                    router.push({pathname: '/homepage', query: {emailVerified: true, username: username}});
                }, 1500)
            }
        });       
    }, [])

    return (
        <>
            <div style={{textAlign: 'center', position: 'relative', marginTop: '10%'}}>
                {!verified ? <p className="body-sub-titles-1 regularfont mt-2"><FormattedMessage id="VARIFY_EMAIL"/></p> :
                    <div>
                        <i className="fa fa-check-circle" style={{fontSize: '4rem', color: '#587E50'}}></i>
                        <p className="body-sub-titles-1 regularfont mt-2"><FormattedMessage id="VARIFY_SUCCESS"/></p>
                        <p className="body-sub-titles-2 regularfont m-0"><FormattedMessage id="REDIRECT_HOME"/></p>
                    </div>
                }
            </div>
        </>
    )

}

export default EmailVerification;