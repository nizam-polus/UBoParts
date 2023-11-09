import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import APIs from '~/services/apiService';

function Dismantle_car() {

    let locale: any;
    
    if(typeof window !== 'undefined'){
        locale = localStorage.getItem("locale")
    }

    const placeholderTranslations : any = {
        nl: {
            plate_number: 'Nummerplaat',
            auto_model: 'Automodel',
            year: 'Jaar',
            mark: 'Merk',
            first_name: 'Voornaam',
            last_name: 'Achternaam',
            email: 'E-mail',
            phone: 'Telefoonnummer',
            delivery_type: 'Leveringstype',
            driving_condition: 'Rijconditie',
            type: 'Type',
            asking_price: 'Vraagprijs',
            streetaddress_housenumber: 'Straatnaam Huisnummer',
            streetaddress_apartment: 'Appartement',
            city: 'Stad',
            state: 'Provincie',
            postcode: 'Postcode',
            type_here: "Typ hier...",
        },
        en: {
            plate_number: 'Plate Number',
            auto_model: 'Auto Model',
            year: 'Year',
            mark: 'Make',
            first_name: 'First Name',
            last_name: 'Last Name',
            email: 'Email',
            phone: 'Phone Number',
            delivery_type: 'Delivery Type',
            driving_condition: 'Driving Condition',
            type: 'Type',
            asking_price: 'Asking Price',
            streetaddress_housenumber: 'Street Address House Number',
            streetaddress_apartment: 'Apartment',
            city: 'City',
            state: 'State',
            postcode: 'Postcode',
            type_here: "Type here...",
        }
    };

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
    const [licensePlate, setLicenseplate] = useState("")

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

    const handleFormChangeEmail = (event: any) =>{
        const { name, value } = event.target;
        setFormData(((prevFormData: any) => ({...prevFormData, [name]: value.toLowerCase()})));
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
        let licensePlate = event.target.value.toUpperCase();
        setLicenseplate(licensePlate)
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
                toast.success(()=>( <FormattedMessage id="FORM_SUCCESS" />), {autoClose: 4000})
            }).catch(err => {
                console.log(err);
                toast.error(()=>( <FormattedMessage id="SOMETHING_WRONG" />), {autoClose: 4000});
            })
        }
    }

    return (
        <>
            <div className="main-body pb-2 mb-5">
                <div className="container">
                    <section className="quote-wrapper mt-5">
                        <div>
                            {incomplete && <p className='required-text' id='required'>* <FormattedMessage id="FILL_REQUIRED_FIELDS"/></p>}
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="quote-inner-wrapper coulmn-bg-color-1 rounded px-3 pt-3 p-sm-5 ps-5 pe-5">
                                    <form>
                                       {
                                        locale &&
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
                                                            value={licensePlate}
                                                            className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.plate_number ? 'required-field' : 'border-0'}`}
                                                            name="plate_number" placeholder={placeholderTranslations[locale]['plate_number']}
                                                            onChange={handleLicenseChange}
                                                        />
                                                    </td>
                                                    <td>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                            <FormattedMessage id="AUTO_MODEL"/> <span className="required">*</span>
                                                        </label>
                                                        <input type="text" 
                                                            className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.auto_model ? 'required-field' : 'border-0'}`}
                                                            name="auto_model" placeholder={placeholderTranslations[locale]['auto_model']} value={formData.auto_model}
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
                                                            name="year" placeholder={placeholderTranslations[locale]['year']} value={formData.year}
                                                            onChange={handleFormChange}
                                                        />
                                                    </td>
                                                    <td>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                            <FormattedMessage id="MAKE"/> <span className="required">*</span>
                                                        </label>
                                                        <input type="text" 
                                                            className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.mark ? 'required-field' : 'border-0'}`} 
                                                            name="mark" placeholder={placeholderTranslations[locale]['mark']} value={formData.mark}
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
                                                            name="first_name" placeholder={placeholderTranslations[locale]['first_name']}
                                                            onChange={handleFormChange}
                                                        />
                                                    </td>
                                                    <td>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                            <FormattedMessage id="LAST_NAME"/> <span className="required">*</span>
                                                        </label>
                                                        <input type="text" 
                                                            className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.last_name ? 'required-field' : 'border-0'}`}
                                                            name="last_name" placeholder={placeholderTranslations[locale]['last_name']}
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
                                                            name="email" placeholder={placeholderTranslations[locale]['email']}
                                                            onChange={handleFormChangeEmail}
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
                                                            name="asking_price" placeholder={placeholderTranslations[locale]['asking_price']} 
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
                                                                name="streetaddress_housenumber" placeholder={placeholderTranslations[locale]['streetaddress_housenumber']} 
                                                                onChange={handleFormChange}
                                                            />
                                                        </div>
                                                        <div>
                                                            <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" 
                                                                name="streetaddress_apartment" placeholder={placeholderTranslations[locale]['streetaddress_apartment']}
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
                                                            name="city" placeholder={placeholderTranslations[locale]['city']} 
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
                                                            name="state" placeholder={placeholderTranslations[locale]['state']}
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
                                                            name="postcode" placeholder={placeholderTranslations[locale]['postcode']}
                                                            onChange={handleFormChange}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2}>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                            <FormattedMessage id="NOTE"/> <span className="required">*</span>
                                                        </label>
                                                        <textarea placeholder={placeholderTranslations[locale]['type_here']} name='note'
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
                                       }
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
