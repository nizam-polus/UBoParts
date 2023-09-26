import { useRouter } from "next/router";
import SellerSideBar from "../seller/SellerSideBar";

function OrderDetails() {

    const router = useRouter();
    const orderId = router.query.orderId;

    return (
        <> 
            <div className="main-body pb-2 mb-5">
            <div className="container">
                <section className="quote-wrapper mt-5">
                    <div className="row mt-3 g-4">
                        <SellerSideBar />
                        <div className="col-12 col-md-9">
                            <div className="coulmn-bg-color-1 rounded">
                                <div className="row d-flex justify-content-between  m-0 p-2 pb-1 pt-3">
                                    <div className="col-auto"><span className="custom-color-2 boldfont body-sub-titles">#{orderId}</span></div>
                                </div>
                                <div className="row m-0 px-0">
                                    <div className="table-responsive">
                                        <table className="table m-0 purchase-history">
                                            <thead >
                                                <tr>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2"></th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Product Name</th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Quantity</th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Order Date</th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Status</th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal pr-4 ps-3 pb-2 pt-2">Order Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
      </>
    )
}

export default OrderDetails;