import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import APIs from "~/services/apiService";

function PaymentResult() {

    const [status, setStatus] = useState('');
    const [timer, setTimer] = useState(5);
    const router = useRouter();

    let interavls: any = [];

    useEffect(() => {
        let transactionId: string = localStorage.getItem('uid') || '';
        let checkPaymentStatus = setInterval(() => {
            interavls.push(checkPaymentStatus)
            APIs.paymentStatus(transactionId).then((response: any) => {
                let status = response.data.rows.length ? response.data.rows[0].status : 'failed';
                setStatus(status);
                if (status !== 'created') {
                    clearInterval(checkPaymentStatus);
                    switch(status) {
                        case 'completed':
                            setStatus('completed');
                            break;
                        case 'failed':
                            setStatus('failed');
                            break;
                        case 'expired' :
                            setStatus('expired');
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
        setTimeout(() => {
            router.push('/homepage');
        }, 10000);
        setTimeout(() => {
            interavls.forEach((interval: any) => clearInterval(interval))
        }, 30000);
    }, [status])

    return (
        <>
            {(!status || status === 'created') ? <h2 className="" style={{textAlign: 'center', position: 'relative', marginTop: '10%'}}>We are processing your payment ...</h2> : 
                <div style={{textAlign: 'center', position: 'relative', marginTop: '10%'}}>
                    <h2 className="" >Order {status === 'completed' ? 'placed successfully' : status !== 'created' && status }</h2>
                    <p>You will be redirected to homepage.</p>
                </div>
            }
        </>
    )
}

export default PaymentResult;