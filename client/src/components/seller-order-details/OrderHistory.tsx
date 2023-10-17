import { useEffect, useRef, useState } from "react";
import SellerSideBar from "../seller/SellerSideBar";
import APIs from "~/services/apiService";
import { UserContext } from "../account_/UserContext";
import Link from "next/link";
import { toast } from "react-toastify";

function OrderHistory() {

    const { user } = UserContext();

    const [orderDetails, setOrderDetails] = useState<any>([]);
    const [emptyText, setEmptyText] = useState<string>('');
    const [rowCount, setRowCount] = useState<any>() 
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const itemsPerPage = 5; 
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const displayedOrders = orderDetails?.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        setEmptyText('Loading...')
        APIs.getSellerOrder(user.username).then((response: any) => {
            const sortedOrders = response.data.rows.sort((a : any, b : any) => {
                const dateA : any = new Date(a.created_at);
                const dateB : any = new Date(b.created_at);
                return dateB - dateA;
            });
            setOrderDetails(sortedOrders);
            setRowCount(response.data.rowCount)
            !response.data.rows.length && setEmptyText('No Data');
        }).catch(err => console.log(err))
    }, []);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
      };
      
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
                                    <div className="col-auto"><span className="custom-color-2 boldfont body-sub-titles">Order History</span></div>
                                </div>
                                <div className="row m-0 px-0">
                                    <div className="table-responsive">
                                        <table className="table m-0 purchase-history">
                                            <thead >
                                                <tr>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal pl-4 ps-3 pb-2 pt-2">Orders</th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Order Date</th>
                                                    <th className="mediumfont custom-color-2 products-name border-0 fw-normal ps-3 pb-2 pt-2">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {displayedOrders && displayedOrders.length > 0 ? displayedOrders.map((order: any) => {
                                                    return (
                                                        <tr>
                                                            <td className="custom-color-2 lightfont placeholderfontsize border-0 pl-4 ps-3 pb-3 pt-3 align-middle">
                                                                <Link href={'/seller/seller-orders/' + order?.orderid}>{order?.orderid}</Link>
                                                            </td>
                                                            <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">
                                                                {new Date(order?.created_at).toDateString().substring(4)}
                                                            </td>
                                                            <td className="custom-color-2 lightfont placeholderfontsize border-0 ps-3 pb-3 pt-3 align-middle">{order?.status}</td>
                                                        </tr>
                                                    )
                                                })
                                             :
                                             <div className="d-flex align-items-center justify-content-center p-5">{emptyText}</div>
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                                <div className="row mt-5">
                                    <div className="col text-center">
                                        <ul className="pagination d-inline-flex">
                                            <li className="page-item">
                                                {currentPage !== 1 ? (
                                                    <a
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        className="page-link border-0 regularfont mini-text-1"
                                                        href="#"
                                                    >
                                                        <i className="fa fa-angle-left custom-color-4 mini-text-1 m-1"></i> Previous
                                                    </a>
                                                ) : (
                                                    <span className="page-link border-0 regularfont mini-text-1 disabled custom-color-4">
                                                        <i className="fa fa-angle-left custom-color-4 mini-text-1 m-1"></i> Previous
                                                    </span>
                                                )}
                                            </li>

                                            {Array.from({ length: Math.min(rowCount, 5) }, (_, index) => {
                                                const page = currentPage - 2 + index;
                                                return page > 0 && page <= Math.ceil(rowCount / itemsPerPage) ? (
                                                    <li
                                                        key={index}
                                                        className={`page-item ${currentPage === page ? 'active' : ''}`}
                                                    >
                                                        <a
                                                            onClick={() => handlePageChange(page)}
                                                            className="page-link border-0 custom-color-3 regularfont mini-text-1"
                                                            href="#"
                                                        >
                                                            {page}
                                                        </a>
                                                    </li>
                                                ) : null;
                                            })}

                                            <li className="page-item">
                                                {currentPage < Math.ceil(rowCount / itemsPerPage) ? (
                                                    <a
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        className="page-link border-0 custom-color-3 regularfont mini-text-1"
                                                        href="#"
                                                    >
                                                        Next <i className="fa fa-angle-right custom-color-3 mini-text-1 m-1"></i>
                                                    </a>
                                                ) : (
                                                    <span className="page-link border-0 custom-color-4 regularfont mini-text-1 disabled">
                                                        Next <i className="fa fa-angle-right custom-color-4 mini-text-1 m-1"></i>
                                                    </span>
                                                )}
                                            </li>
                                        </ul>
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

export default OrderHistory;