import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import APIs from "~/services/apiService";

function PaymentResult() {

    const [status, setStatus] = useState('');
    const [path, setPath] = useState('')
    const router = useRouter();

    let interavls: any = [];

    useEffect(() => {
        let transactionId: string = localStorage.getItem('uid') || '';
        let checkPaymentStatus = setInterval(() => {
            interavls.push(checkPaymentStatus)
            APIs.paymentStatus(transactionId).then((response: any) => {
                let status = response.data.rows.length ? response.data.rows[0].status : 'failed';
                if (status !== 'created') {
                    clearInterval(checkPaymentStatus);
                    switch(status) {
                        case 'completed':
                            setPath('/order-summary');
                            setStatus('completed');
                            break;
                        case 'failed':
                            setPath('/homepage');
                            setStatus('failed');
                            break;
                        case 'expired' :
                            setPath('/homepage');
                            setStatus('expired');
                            break;
                        default:
                            setPath('/homepage');
                            setStatus(status);
                            console.log('unknown status', status);
                            break;
                    }
                }
            })
        }, 5000)
    }, [])

    useEffect(() => {
        setTimeout(() => {
            router.push(path);
        }, 7000);
        setTimeout(() => {
            interavls.forEach((interval: any) => clearInterval(interval))
        }, 1000 * 60 * 5);
    }, [status])

    return (
        <>
            {(!status || status === 'created') ? <h2 className="" style={{textAlign: 'center', position: 'relative', marginTop: '10%'}}>Your request is being processed ...</h2> : 
                <div style={{textAlign: 'center', position: 'relative', marginTop: '10%'}}>
                    <h2 className="" >Order {status === 'completed' ? 'placed successfully' : status }</h2>
                    <p>You will be redirected to { status === 'completed' ? ' order summary page' : ' homepage'}.</p>
                </div>
            }
        </>
    )
}

export default PaymentResult;