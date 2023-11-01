import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import APIs from '~/services/apiService';

function Dismantle_car() {

    const [formData, setFormData] = useState<any>({
        plate_number: '',
        auto_model: '',
        year: '',
        mark: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        delivery_type: '',
        driving_condition: '',
        type: '',
        asking_price: '',
        streetaddress_housenumber: '',
        streetaddress_apartment: '',
        city: '',
        state: '',
        postcode: '',
        note: '',
        country: []
    });
    const [imageData, setImageData] = useState('');
    const [countries, setCountries] = useState([]);
    const [incomplete, setIncomplete] = useState(false);

    useEffect(() => {
        APIs.getCountries().then(response => {
            setCountries(response.data.data);
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []); 

    const checkFormStatus = () => {
        let incomplete = true;
        incomplete = !(!!formData.asking_price && !!formData.auto_model && !!imageData && 
                !!formData.city && !!formData.delivery_type && !!formData.driving_condition && 
                !!formData.email && !!formData.first_name && !!formData.last_name && !!formData.country.length &&
                !!formData.mark && !!formData.note && !!formData.phone && !!formData.plate_number && !!formData.type &&
                !!formData.postcode && !!formData.state && !!formData.streetaddress_housenumber && !!formData.year);
        return incomplete;
    }

    const handleFormChange = (event: any) => {
        const { name, value } = event.target;
        setFormData(((prevFormData: any) => ({...prevFormData, [name]: value})));
    }

    const handleCountryChange = (event: any) => {
        let countryId = [Number(event.target.value)];
        setFormData((prevData: any) => ({...prevData, country: countryId}));
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
                formData.mark = response.data.make;
                formData.auto_model = response.data.model;
                formData.year = response.data.year;
                setFormData({...formData});
            })
        }, 1000)
    }

    const handleDismantleSubmit = (event: any) => {
        event.preventDefault();
        setFormData((prevData: any) => ({...prevData, asking_price: Number(formData.asking_price)}));
        let incomplete = checkFormStatus();
        setIncomplete(incomplete);
        let reqElement = document.getElementById('required');
        if (reqElement && incomplete) reqElement.scrollIntoView({behavior: 'smooth'});
        if (!incomplete) {
            APIs.dismantleCar(formData).then(response => {
                const refId = response.data.data.id
                const picData = {
                    ref: 'api::dismantle.dismantle',
                    refId: refId,
                    field: 'car_image',
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
                                    <form>
                                        <div className="table-responsive">
                                            <table className="table quote-table">
                                                <tbody>
                                                    <tr>
                                                        <th colSpan={2} 
                                                            className="pt-0 pb-0 px-0 ps-0 custom-color-2 regularfont subtitles fw-normal border-top-0 border-bottom-0"
                                                        >
                                                            <FormattedMessage id="DISMANTLE_CAR"/>
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2} className="pb-4 pt-4 pl-0 semifont boldfontsize border-top-0"> 
                                                            <hr className="p-0 m-0 " />
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="PLATE_NO"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" 
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.plate_number ? 'required-field' : 'border-0'}`}
                                                                name="plate_number" placeholder="Plate Number" 
                                                                onChange={handleLicenseChange}
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="AUTO_MODEL"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" 
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.auto_model ? 'required-field' : 'border-0'}`}
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
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.year ? 'required-field' : 'border-0'}`}
                                                                name="year" placeholder="Year" value={formData.year}
                                                                onChange={handleFormChange}
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="MAKE"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" 
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.mark ? 'required-field' : 'border-0'}`} 
                                                                name="mark" placeholder="Make" value={formData.mark}
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
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.first_name ? 'required-field' : 'border-0'}`} 
                                                                name="first_name" placeholder="First Name" 
                                                                onChange={handleFormChange}
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="LAST_NAME"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" 
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.last_name ? 'required-field' : 'border-0'}`}
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
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.email ? 'required-field' : 'border-0'}`}
                                                                name="email" placeholder="Email Address" 
                                                                onChange={handleFormChange}
                                                            />
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="PHONE"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" 
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.phone ? 'required-field' : 'border-0'}`}
                                                                name="phone" placeholder="(XXX) XXX-XXXX" 
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
                                                                            name="delivery_type" id="driving_type_delivery" value={'Delivery'}
                                                                            onChange={handleFormChange}
                                                                        />
                                                                        <label htmlFor="driving_type_pickup" className="rounded"></label>
                                                                    </span>
                                                                    <span className="regularfont pl-2"><FormattedMessage id="DELIVERY"/></span>
                                                                </div>
                                                                <div className="position-relative d-flex">
                                                                    <span>
                                                                        <input type="radio" 
                                                                            name="delivery_type" id="driving_type_pickup" value={'Pickup'}
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
                                                                <FormattedMessage id="DRIVING_CONDITION"/> <span className="required">*</span>
                                                            </label>
                                                            <fieldset>
                                                                <div className="position-relative d-flex">
                                                                    <span>
                                                                        <input type="radio" 
                                                                            name="driving_condition" id="driving_condition_pickup" value={'Drivable'}
                                                                            onChange={handleFormChange}
                                                                        />
                                                                        <label htmlFor="driving_type_pickup" className="rounded"></label>
                                                                    </span>
                                                                    <span className="regularfont pl-2"><FormattedMessage id="DRIVABLE"/></span>
                                                                </div>
                                                                <div className="position-relative d-flex">
                                                                    <span>
                                                                        <input type="radio" 
                                                                            name="driving_condition" id="driving_condition_pickup" value={'Not Drivable'}
                                                                            onChange={handleFormChange}
                                                                        />
                                                                        <label htmlFor="driving_type_pickup" className="rounded"></label>
                                                                    </span>
                                                                    <span className="regularfont pl-2"><FormattedMessage id="NOT_DRIVABLE"/></span>
                                                                </div>
                                                            </fieldset>
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                            <FormattedMessage id="TYPE" /> <span className="required">*</span>
                                                        </label>
                                                            <fieldset>
                                                                <div className="position-relative d-flex" >
                                                                    <span>
                                                                        <input type="radio" 
                                                                            name="type" id="catalyser_type_imitation" value={'Catalyser'}
                                                                            onChange={handleFormChange}
                                                                        />
                                                                        <label htmlFor="driving_type_pickup" className="rounded"></label>
                                                                    </span>
                                                                    <span className="regularfont pl-2"><FormattedMessage id="CATALYSER" /></span>
                                                                </div>
                                                                <div className="position-relative d-flex" >
                                                                    <span>
                                                                        <input type="radio" 
                                                                            name="type" id="catalyser_type_imitation" value={'Imitation'}
                                                                            onChange={handleFormChange}
                                                                        />
                                                                        <label htmlFor="driving_type_pickup" className="rounded"></label>
                                                                    </span>
                                                                    <span className="regularfont pl-2"><FormattedMessage id="IMITATION"/></span>
                                                                </div>
                                                                <div className="position-relative d-flex">
                                                                    <span>
                                                                        <input type="radio" 
                                                                            name="type" id="catalyser_type_original" value={'Original'}
                                                                            onChange={handleFormChange}
                                                                        />
                                                                        <label htmlFor="driving_type_pickup" className="rounded"></label>
                                                                    </span>
                                                                    <span className="regularfont pl-2"><FormattedMessage id="ORIGINAL" /></span>
                                                                </div>
                                                            </fieldset>
                                                        </td>
                                                        <td>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2 ">
                                                                <FormattedMessage id="ASKING_PRICE"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="number" 
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.asking_price ? 'required-field' : 'border-0'}`} 
                                                                name="asking_price" placeholder="Asking Price (€)" 
                                                                onChange={handleFormChange}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="double">
                                                        <td>
                                                            <label className={`body-sub-titles`}>
                                                                <FormattedMessage id="CAR_IMAGE"/> <span className="required">*</span>
                                                            </label>
                                                            <input className={`form-control p-2 choosefile ${incomplete && !imageData ? 'required-field' : 'border-0'}`} 
                                                                type="file" id="formFile" name='car_image'
                                                                onChange={handleImageUpload} 
                                                            />
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="COUNTRY" /> <span className="required">*</span>
                                                            </label>
                                                            <select className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.country.length ? 'required-field' : 'border-0'}`}
                                                                style={{height: '3.5rem'}} name="country" value={formData.country}
                                                                onChange={(e) => handleCountryChange(e)}
                                                            >
                                                                <option className="mini-text-2" value="" disabled>Select Country</option>
                                                                {countries.map((country: any) => (
                                                                <option key={country.id} value={country.id}>{country.attributes.country}</option>))}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <div className="mb-3">
                                                                <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                    <FormattedMessage id="STREET_ADDRESS"/> <span className="required">*</span>
                                                                </label>
                                                                <input type="text" className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.streetaddress_housenumber ? 'required-field' : 'border-0'}`}
                                                                    name="streetaddress_housenumber" placeholder="House number and street name" 
                                                                    onChange={handleFormChange}
                                                                />
                                                            </div>
                                                            <div>
                                                                <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" 
                                                                    name="streetaddress_apartment" placeholder="Apartment, suite, unit etc..." 
                                                                    onChange={handleFormChange}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="CITY"/> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.city ? 'required-field' : 'border-0'}`} 
                                                                name="city" placeholder="City" 
                                                                onChange={handleFormChange}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="STATE" /> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.state ? 'required-field' : 'border-0'}`}
                                                                name="state" placeholder="State" 
                                                                onChange={handleFormChange}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="POST_CODE" /> <span className="required">*</span>
                                                            </label>
                                                            <input type="text" className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.postcode ? 'required-field' : 'border-0'}`}
                                                                name="postcode" placeholder="Postcode" 
                                                                onChange={handleFormChange}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2}>
                                                            <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                                <FormattedMessage id="NOTE"/> <span className="required">*</span>
                                                            </label>
                                                            <textarea placeholder="Type here..." name='note'
                                                                className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.note ? 'required-field' : 'border-0'}`} 
                                                                rows={4}
                                                                onChange={handleFormChange}
                                                            ></textarea>
                                                        </td>
                                                    </tr>
                                                    <tr className="single">
                                                        <td colSpan={2} className="">
                                                            <button type="submit" 
                                                                className="place-quote text-white mediumfont body-sub-titles-1 rounded-lg border-0 button-bg-color-1 h-auto p-2 ubo-btn-custom"
                                                                onClick={handleDismantleSubmit}
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
export default Dismantle_car;
