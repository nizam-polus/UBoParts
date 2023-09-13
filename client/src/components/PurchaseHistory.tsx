import SellerSideBar from "./seller/SellerSideBar";

function PurchaseHistory() {
    return (
        <> 
            <div className="main-body pb-2 mb-5">
            <div className="container">
                <section className="quote-wrapper mt-5">
                    <div className="row mt-3 g-4">
                        <SellerSideBar />
                        <div className="col-12 col-md-9">
                            <h2>Purchase History</h2>
                        </div>
                    </div>
                </section>
            </div>
        </div>
      </>
    )
}

export default PurchaseHistory;