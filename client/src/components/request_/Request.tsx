import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import APIs from '~/services/apiService';

function Request() {

    const [formData, setFormData] = useState<any>({
        plate_number: '',
        auto_model: '',
        year: '',
        make: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        delivery_type: '',
        minprice: '',
        maxprice: '',
        quantity: '',
        description: ''
    });
    const [imageData, setImageData] = useState('');
    const [incomplete, setIncomplete] = useState(false);

    const checkFormStatus = () => {
        let incomplete = true;
        incomplete = !(!!formData.plate_number && !!formData.auto_model && !!imageData && 
                !!formData.delivery_type && !!formData.email && !!formData.first_name && 
                !!formData.last_name && !!formData.make && !!formData.year &&
                !!formData.phone_number && !!formData.minprice && !!formData.maxprice &&
                !! formData.quantity && !!formData.description);
        return incomplete;
    }

    const handleFormChange = (event: any) => {
        const { name, value } = event.target;
        setFormData(((prevFormData: any) => ({...prevFormData, [name]: value})));
    }

    const handleImageUpload = (event: any) => {
        const file = event.target.files[0];
        setImageData(file);
    }

    const handleLicenseChange = (event: any) => {
        let licensePlate = event.target.value;
        formData.plate_number = licensePlate;
        setFormData({...formData});
        setTimeout(() => {
            APIs.getCarDetailsUsingLicence(licensePlate).then(response => {
                formData.make = response.data.make;
                formData.auto_model = response.data.model;
                formData.year = response.data.year;
                setFormData({...formData});
            })
        }, 1000);
    }

    const handleRequestSubmit = (event: any) => {
        event.preventDefault();
        setFormData((prevData: any) => ({...prevData, minprice: parseFloat(formData.minprice)}));
        setFormData((prevData: any) => ({...prevData, maxprice: parseFloat(formData.maxprice)}));
        setFormData((prevData: any) => ({...prevData, quantity: Number(formData.quantity)}));
        let incomplete = checkFormStatus();
        setIncomplete(incomplete);
        let reqElement = document.getElementById('required');
        if (reqElement && incomplete) reqElement.scrollIntoView({behavior: 'smooth'});
        if (!incomplete) {
            APIs.requestPart(formData).then(response => {
                const refId = response.data.data.id
                const picData = {
                    ref: 'api::request-part.request-part',
                    refId: refId,
                    field: 'part_image',
                    files: imageData
                }
                APIs.uploadImageForDismantle(picData).then()
                toast.success('Form submitted succesfully', {autoClose: 4000})
            }).catch(err => {
                console.log(err);
                toast.error('Something went wrong.', {autoClose: 4000});
            })
        }
    }

    return (
        <>
            <div className="main-body pb-2 mb-5">
                <div className="container">
                    <section className="quote-wrapper mt-5">
                        <div>
                            {incomplete && <p className='required-text' id='required'>* Please fill the required fields</p>}
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="quote-inner-wrapper coulmn-bg-color-1 rounded px-3 pt-3 p-sm-5 ps-5 pe-5">
                                    <form action="">
                                        <div className="table-responsive">
                                            <table className="table quote-table">
                                                <tbody>
                                                    <tr>
                                                        <th colSpan={2} 
                                                            className="pt-0 pb-0 px-0 ps-0 custom-color-2 regularfont subtitles fw-normal border-top-0 border-bottom-0"
                                                        >
                                                            <FormattedMessage id="REQUEST_PARTS"/>
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2} className="pb-4 pt-4 pl-0 semifont boldfontsize border-top-0">
                                                            <hr className="p-0 m-0 " />
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2 ">
                                                                <FormattedMessage id="PLATE_NO"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" 
                                                                className={`w-100 form-control input-bg-color-2 body-sub-titles-1 ${incomplete && !formData.plate_number ? 'required-field' : 'border-0'}`}
                                                                name="plate_number" placeholder="Plate Number" 
                                                                onChange={handleLicenseChange}
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2 ">
                                                                <FormattedMessage id="AUTO_MODEL"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" 
                                                                className={`form-control input-bg-color-2 body-sub-titles-1 ${incomplete && !formData.auto_model ? 'required-field' : 'border-0'}`}
                                                                name="auto_model" placeholder="Auto Model" value={formData.auto_model}
                                                                onChange={handleFormChange}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="YEAR"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" 
                                                                className={`form-control input-bg-color-2 body-sub-titles-1 ${incomplete && !formData.year ? 'required-field' : 'border-0'}`} 
                                                                name="year" placeholder="Year" value={formData.year}
                                                                onChange={handleFormChange}
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="MAKE"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" 
                                                                className={`form-control input-bg-color-2 body-sub-titles-1 ${incomplete && !formData.make ? 'required-field' : 'border-0'}`}
                                                                name="make" placeholder="Make" value={formData.make}
                                                                onChange={handleFormChange}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="FIRST_NAME"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" 
                                                                className={`form-control input-bg-color-2 body-sub-titles-1 ${incomplete && !formData.first_name ? 'required-field' : 'border-0'}`}
                                                                name="first_name" placeholder="First Name" 
                                                                onChange={handleFormChange}
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="LAST_NAME"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" 
                                                                className={`form-control input-bg-color-2 body-sub-titles-1 ${incomplete && !formData.last_name ? 'required-field' : 'border-0'}`}
                                                                name="last_name" placeholder="Last Name" 
                                                                onChange={handleFormChange}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="EMAIL_ADDRESS"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" 
                                                                className={`form-control input-bg-color-2 body-sub-titles-1 ${incomplete && !formData.email ? 'required-field' : 'border-0'}`}
                                                                name="email" placeholder="Email Address" 
                                                                onChange={handleFormChange}
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="PHONE"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" 
                                                                className={`form-control input-bg-color-2 body-sub-titles-1 ${incomplete && !formData.phone_number ? 'required-field' : 'border-0'}`}
                                                                name="phone_number" placeholder="(XXX) XXX-XXXX" 
                                                                onChange={handleFormChange}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                            <FormattedMessage id="DELIVERY_TYPE"/> <span className="required">*</span>
                                                        </label>
                                                            <fieldset>
                                                                <div className="position-relative d-flex">
                                                                    <span>
                                                                        <input type="radio" 
                                                                            name="delivery_type" id="driving_type_delivery" value={'delivery'}
                                                                            onChange={handleFormChange}
                                                                        />
                                                                        <label htmlFor="driving_type_pickup" className="rounded"></label>
                                                                    </span>
                                                                    <span className="regularfont pl-2"><FormattedMessage id="DELIVERY"/></span>
                                                                </div>
                                                                <div className="position-relative d-flex">
                                                                    <span>
                                                                        <input type="radio" 
                                                                            name="delivery_type" id="driving_type_pickup" value={'pickup'}
                                                                            onChange={handleFormChange}
                                                                        />
                                                                        <label htmlFor="driving_type_pickup" className="rounded"></label>
                                                                    </span>
                                                                    <span className="regularfont pl-2"><FormattedMessage id="PICKUP"/></span>
                                                                </div>
                                                            </fieldset>
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="BUYING_RANGE"/> <span className="required">*</span>
                                                            </label>
                                                            <div className="d-flex">
                                                                <div className="col pl-0">
                                                                    <input type="number" 
                                                                        className={`form-control input-bg-color-2 body-sub-titles-1 ${incomplete && !formData.minprice ? 'required-field' : 'border-0'}`}
                                                                        placeholder="Min Price" name='minprice'
                                                                        onChange={handleFormChange}
                                                                    />
                                                                </div>
                                                                <div className="col-auto align-self-center p-2">to</div>
                                                                <div className="col pr-0">
                                                                    <input type="number" 
                                                                        className={`form-control input-bg-color-2 body-sub-titles-1 ${incomplete && !formData.maxprice ? 'required-field' : 'border-0'}`}
                                                                        placeholder="Max Price" name='maxprice'
                                                                        onChange={handleFormChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="PART_IMAGES"/> <span className="required">*</span>
                                                            </label>
                                                            <input className={`form-control p-2 choosefile ${incomplete && !imageData ? 'required-field' : 'border-0'}`}
                                                                type="file" id="formFile" 
                                                                onChange={handleImageUpload}
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="QUANTITY"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="number" 
                                                                className={`form-control input-bg-color-2 body-sub-titles-1 ${incomplete && !formData.quantity ? 'required-field' : 'border-0'}`}
                                                                name="quantity" placeholder="Quantity" 
                                                                onChange={handleFormChange}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="DESCRIPTION_OF_PRODUCT"/> <span className="required">*</span>
                                                            </label>
                                                            <textarea placeholder="Type here..." 
                                                                className={`form-control input-bg-color-2 body-sub-titles-1 ${incomplete && !formData.description ? 'required-field' : 'border-0'}`}
                                                                rows={4} name='description'
                                                                onChange={handleFormChange}
                                                            ></textarea>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2} className="">
                                                            <button type="submit" 
                                                                className="place-quote text-white mediumfont body-sub-titles-1 rounded-lg border-0 button-bg-color-1 h-auto p-2 ubo-btn-custom"
                                                                onClick={handleRequestSubmit}
                                                            ><FormattedMessage id="SUBMIT"/></button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
export default Request;