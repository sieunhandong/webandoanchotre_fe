import { useEffect } from 'react';
import { getDetailOrder } from '@/apis/orderService';
import { useLocation } from 'react-router-dom';

function Orders() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const id = params.get('id');
    const totalAmount = params.get('totalAmount');

    const qrCodeImage = `https://qr.sepay.vn/img?acc=VQRQAEQNT2617&bank=MBBank&amount=${totalAmount}&des=${id}`;

    const handleGetDetailOrder = async () => {
        try {
            const res = await getDetailOrder(id);
            console.log(res);
        } catch (error) {
            console.log(res);
        }
    };

    useEffect(() => {
        handleGetDetailOrder();
    }, []);

    return (
        <div>
            <img src={qrCodeImage} alt="" />
        </div>
    );
}

export default Orders;
