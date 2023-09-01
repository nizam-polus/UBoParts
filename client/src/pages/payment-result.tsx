import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header_home from "~/components/header_/Header_home";
import APIs from "~/services/apiService";

function PaymentResult() {

    const [status, setStatus] = useState('');
    const [timer, setTimer] = useState(5);
    const router = useRouter();

    useEffect(() => {
        let transactionId: string = localStorage.getItem('uid') || '';
        let checkPaymentStatus = setInterval(() => {
            APIs.paymentStatus(transactionId).then((response: any) => {
                console.log(response);
                let status = response.data.rows[0].status;
                setStatus(status);
                if (status !== 'created') {
                    clearInterval(checkPaymentStatus);
                    switch(status) {
                        case 'completed':
                            setStatus('completed');
                            console.log('completed');
                            break;
                        case 'failed':
                            setStatus('failed');
                            console.log('failed');
                            break;
                        case 'expired' :
                            setStatus('expired');
                            console.log('expired');
                            break;
                        default:
                            setStatus(status)
                            console.log('unknown status', status);
                            break;
                    }
                }
            })
        }, 5000)
    }, [])

    useEffect(() => {
        setTimeout(() => router.push('/homepage'), 10000)
    }, [status])

    return (
        <>
            {(!status || status === 'created') ? <h2 className="" style={{textAlign: 'center', position: 'relative', marginTop: '10%'}}>We are processing your payment ...</h2> : 
                <div style={{textAlign: 'center', position: 'relative', marginTop: '10%'}}>
                    <h2 className="" >Payment {status}</h2>
                    <p>You will be redirected to homepage.</p>
                </div>
            }
        </>
    )
}

export default PaymentResult;