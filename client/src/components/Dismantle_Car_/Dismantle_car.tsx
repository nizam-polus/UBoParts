import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import APIs from '~/services/apiService';
import { useRouter } from 'next/router';

function Dismantle_car() {

    let locale: any;
    const router = useRouter()
    
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
        make: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        phone: '',
        delivery_type: '',
        driving_condition: '',
        type: '',
        asking_price: '',
        streetaddress_housenumber: '',
        street_address: "",
        appartment: "",
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
    const [makesArray, setMakesArray] = useState<any>([]);
    const [modelArray, setModelArray] = useState<any>([]);
    const [yearArray, setYearArray] = useState<any>([]);
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showInvaidLicense, setShowInvaidLicense] = useState(false);
    const [makeName, setMakeName] = useState('')
    const [modelName, setModelName] = useState('')
    const [year, setYear] = useState('')
    const [error, setError] = useState(null);
    const [imageDataList, setImageDataList] = useState<any>([]);

    const handleImageUpload = (event: any) => {
        const files = event.target.files;
        const newImages = Array.from(files);
        setImageDataList([...imageDataList, ...newImages]);
    }

    const handleImageDelete = (index: any) => {
        const newImages = [...imageDataList];
        newImages.splice(index, 1);
        setImageDataList(newImages);        
    }

    useEffect(() => {
        APIs.getCountries().then(response => {
            setCountries(response.data.data);
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []); 

    const checkFormStatus = () => {
        let incomplete = true;
        incomplete = !(!!formData.asking_price && !!formData.auto_model && !!imageDataList.length && 
                !!formData.city && !!formData.delivery_type && !!formData.driving_condition && 
                !!formData.email && !!formData.first_name && !!formData.last_name && !!formData.country.length &&
                !!formData.mark && !!formData.note && !!formData.phone_number && !!formData.plate_number && !!formData.type &&
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
    
    const handleStreetAddressChange = (event : any) =>{
        const { name, value } = event.target;
        setFormData(((prevFormData: any) => ({...prevFormData, [name]: value, "street_address": value})));  
    }

    const handlePhoneChange = (event: any) =>{
        const {name,value} = event.target;
        setFormData((prevFormData: any) => ({...prevFormData, [name]: value, "phone": value}))
    }

    const handleAppartmentChange = (event : any) =>{
        const { name, value } = event.target;
        setFormData(((prevFormData: any) => ({...prevFormData, [name]: value, "appartment": value})));  
    }
    // const handleImageUpload = (event: any) => {
    //     const file = event.target.files[0];
    //     setImageData(file);
    // }

    useEffect(() => {
        if (licensePlate && licensePlate.length > 5) {
            const getData = setTimeout(() => {
                APIs.getCarDetailsUsingLicence(licensePlate).then((response: any) => {
                    if (response.data.licenseplate) {
                        let make = response.data.make.toUpperCase();
                        let model = response.data.model.toUpperCase();
                        let year = response.data.year;
                        for (let makeObj of makesArray) {
                            if (makeObj.make.toUpperCase() === make) {
                                setSelectedMake(makeObj.id);
                                setMakeNameFn(makeObj.id)
                                setSelectedModel('');
                                setSelectedYear('');
                                APIs.getCarModel(makeObj.id).then(response => {
                                    let modelArray = response.data.rows;
                                    setModelArray(modelArray);
                                    let similarModels: any = [], i = 0;
                                    for (let modelObj of modelArray) {
                                        if (modelObj.model.toUpperCase() === model) {
                                            setSelectedModel(modelObj.id);
                                            setModelNameFn(modelObj.id, modelArray)
                                            APIs.getCarYear(modelObj.id).then(response => {
                                                let yearArray = response.data.rows;
                                                setYearArray(yearArray);
                                                for (let yearObj of yearArray) {
                                                    if (yearObj.year === year) {
                                                        setSelectedYear(yearObj.id);
                                                        setYearChangeFn(yearObj.id, yearArray)
                                                    }
                                                }
                                            })
                                            break;
                                        } else {
                                            if (modelObj.model.toUpperCase().includes(model)) {
                                                i += 1;
                                                similarModels.push(modelObj);
                                                if (i === 1) {
                                                    setSelectedModel(modelObj.id);
                                                    setModelNameFn(modelObj.id, modelArray)
                                                    APIs.getCarYear(modelObj.id).then(response => {
                                                        let yearArray = response.data.rows;
                                                        setYearArray(yearArray);
                                                        for (let yearObj of yearArray) {
                                                            if (yearObj.year === year) {
                                                                setSelectedYear(yearObj.id);
                                                                setYearChangeFn(yearObj.id, yearArray)
                                                            }
                                                        }
                                                    })
                                                } 
                                            }
                                        }
                                    }
                                })
                            }
                        }
                        setShowInvaidLicense(false);
                    } else {
                        setShowInvaidLicense(true);
                        setSelectedMake('');
                        setSelectedModel('');
                        setSelectedYear('');
                        setSelectedCategory('')
                    }
                });
            }, 1000);
            return () => clearTimeout(getData);
        }
    }, [licensePlate]);

    useEffect(() =>{
        APIs.getCarMake().then((response: any) => {
            setMakesArray(response.data.rows);
        })
        .catch((error) => {
            setError(error);
        });
    },[])


    const handleLicenseChange = (event: any) => {
        let licensePlate = event.target.value.toUpperCase();
        setLicenseplate(licensePlate)
        formData.plate_number = licensePlate;
        setFormData({...formData});
        setTimeout(() => {
            APIs.getCarDetailsUsingLicence(licensePlate).then(response => {
                formData.make = response.data.make;
                setSelectedMake(response.data.make)
                formData.auto_model = response.data.model;
                setSelectedModel(response.data.model)
                formData.year = response.data.year;
                setSelectedYear(response.data.year)
                setFormData({...formData});
            })
        }, 1000)
    }

    const setMakeNameFn = (Id: any) => {
        const selectedMake = makesArray.find((make: any) => make.id == Id);
        if (selectedMake) {
            setMakeName(selectedMake.make);
            formData.make = selectedMake.make
            formData.mark = selectedMake.make
        }
    }

    const setModelNameFn = (Id: any, modelArray: any) => {
        const selectedModelName = modelArray.find((model: any) => model.id == Id);

        if(selectedModelName){
            setModelName(selectedModelName.model)
            formData.auto_model = selectedModelName.model
        }
    }

    const setYearChangeFn = (Id: any, yearArray: any) => {
        const selectedYearName = yearArray.find((year: any) => year.id == Id);
        if(selectedYearName){
            setYear(selectedYearName.year)
            formData.year = selectedYearName.year
        } 
    }

    const handleMakeChange = (event: any) => {
        const selectedValue = event.target.value;
        setSelectedMake(selectedValue);
        getModel(selectedValue)
        setMakeNameFn(selectedValue)

    };

    const getModel = (makeId: any) => {
        // const setData : any = { 'param_make': make }
        Number(makeId)
        APIs.getCarModel(makeId).then((response: any) => {
            setModelArray(response.data.rows);
        })
            .catch((error) => {
                setError(error);
            });
    }

    const getYear = (make: string, modelId: any) => {
        const setData : any = { 'param_make': make, 'param_model': modelId }
        APIs.getCarYear(Number(modelId)).then((response: any) => {
            setYearArray(response.data.rows);
        })
            .catch((error) => {
                setError(error);
            });
    }

    const handleModelChange = (event: any) => {
        const selectedValue = event.target.value;
        setSelectedModel(event.target.value);
        setSelectedYear('');
        setSelectedCategory('');
        getYear(selectedModel, event.target.value);
        setModelNameFn(selectedValue, modelArray)
    };

    const handleYearChange = (event: any) => {
        const selectedValue = event.target.value;
        setSelectedYear(event.target.value);
        setSelectedCategory('');
        setYearChangeFn(selectedValue, yearArray)
    };


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
                for(let i=0; i<imageDataList.length; i++){
                const picData = {
                    ref: 'api::dismantle.dismantle',
                    refId: refId,
                    field: 'car_image',
                    files: imageDataList[i]
                }
                APIs.uploadImageForDismantle(picData).then(()=>{
                    setLicenseplate("")
                    setSelectedMake("")
                    setFormData({})
                })
                }  
            }).then(() =>{
                toast.success(()=>( <FormattedMessage id="FORM_SUCCESS" />), {autoClose: 4000})
                APIs.DismantleEmailSend({ "dismantle_car" : formData, "lang" : locale }).then((res: any) =>{
                    console.log(res)
                }).catch((err) =>{
                    toast.error(err)
                })
                router.push("/")
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
                                                            <FormattedMessage id="MAKE"/> <span className="required">*</span>
                                                        </label>
                                                        {/* <input type="text" 
                                                            className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.mark ? 'required-field' : 'border-0'}`} 
                                                            name="mark" placeholder={placeholderTranslations[locale]['mark']} value={formData.mark}
                                                            onChange={handleFormChange}
                                                        /> */}
                                                        <select className={`form-select input-bg-color-2 border-0 products-name custom-color-2 ${incomplete && !selectedMake ? 'required-field' : 'border-0'}`} name="make" id="makeOption"
                                                            value={selectedMake} onChange={handleMakeChange}>
                                                            <option value="" disabled={true}>{locale == "nl" ? "Selecteer merk" : "Select Make"}</option>
                                                            {makesArray && makesArray.map((make: any, index: any) => (
                                                                <option key={index} value={make.id}>{make.make}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    
                                                </tr>
                                                <tr className="double">
                                                <td>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                            <FormattedMessage id="AUTO_MODEL"/> <span className="required">*</span>
                                                        </label>
                                                        {/* <input type="text" 
                                                            className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.auto_model ? 'required-field' : 'border-0'}`}
                                                            name="auto_model" placeholder={placeholderTranslations[locale]['auto_model']} value={formData.auto_model}
                                                            onChange={handleFormChange}
                                                        /> */}
                                                        <select disabled={!selectedMake} className={`form-select input-bg-color-2 border-0 products-name custom-color-2 ${incomplete && !selectedModel ? 'required-field' : 'border-0'}`} name="model" id="modelOption"
                                                            value={selectedModel} onChange={handleModelChange}>
                                                            <option value="" disabled={!selectedMake}>{locale == "nl"? "Selecteer Model" : "Select Model"}</option>
                                                            {modelArray && modelArray.map((model: any, index: any) => (
                                                                <option key={index} value={model.id}>{model.model}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <label className="custom-color-2 regularfont body-sub-titles-1 pb-2">
                                                            <FormattedMessage id="YEAR"/> <span className="required">*</span>
                                                        </label>
                                                        {/* <input type="text" 
                                                            className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !formData.year ? 'required-field' : 'border-0'}`}
                                                            name="year" placeholder={placeholderTranslations[locale]['year']} value={formData.year}
                                                            onChange={handleFormChange}
                                                        /> */}
                                                        <select disabled={!selectedModel || (yearArray && yearArray.length && !yearArray[0].year)} 
                                                            className={`form-select input-bg-color-2 border-0 products-name custom-color-2 ${incomplete && !selectedYear ? 'required-field' : 'border-0'}`} 
                                                            name="year" id="yearOption"
                                                            value={selectedYear} onChange={handleYearChange}>
                                                            <option value="" disabled={!selectedModel}>{locale == "nl"? "Selecteer Jaar" : "Select Year"}</option>
                                                            {yearArray && yearArray.map((year: any, index: any) => (
                                                                <option key={index} value={year.id}>{year.year}</option>
                                                            ))}
                                                        </select>
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
                                                            name="phone_number" placeholder="(XXX) XXX-XXXX" 
                                                            onChange={handlePhoneChange}
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
                                                        <FormattedMessage id="CATALYSER_TYPE" /> <span className="required">*</span>
                                                    </label>
                                                        <fieldset>
                                                            {/* <div className="position-relative d-flex" >
                                                                <span>
                                                                    <input type="radio" 
                                                                        name="type" id="catalyser_type_imitation" value={'Catalyser'}
                                                                        onChange={handleFormChange}
                                                                    />
                                                                    <label htmlFor="driving_type_pickup" className="rounded"></label>
                                                                </span>
                                                                <span className="regularfont pl-2"><FormattedMessage id="CATALYSER" /></span>
                                                            </div> */}
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
                                                        {/* <input className={`form-control p-2 choosefile ${incomplete && !imageData ? 'required-field' : 'border-0'}`} 
                                                            type="file" id="formFile" name='car_image'
                                                            onChange={handleImageUpload} 
                                                        /> */}
                                                        <input
                                                                    className={`form-control p-2 choosefile ${incomplete && !imageDataList.length ? 'required-field' : 'border-0'}`}
                                                                    type="file"
                                                                    id="formFile"
                                                                    name="car_image"
                                                                    onChange={handleImageUpload}
                                                                    multiple  // Allow multiple file selection
                                                                />
                                                                <div className="selected-gallery-images" style={{ padding: "10px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                                                    {imageDataList.map((image: any, index: any) => (
                                                                        <div key={index} style={{ position: 'relative', maxWidth: "210px" }}>
                                                                            <img src={URL.createObjectURL(image)} alt={`Image ${index}`} height={200} style={{ width: "100%", borderRadius: "20px"}}/>
                                                                            <button onClick={() => handleImageDelete(index)} style={{ position: 'absolute', top: '5px', right: '10px', border: "none", color: "red", background: "none" }}>
                                                                                <i className='fa fa-trash'></i>
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
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
                                                            <option className="mini-text-2" value="" disabled>{locale == "nl" ? "Selecteer land" : "Select country"}</option>
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
                                                                onChange={handleStreetAddressChange}
                                                            />
                                                        </div>
                                                        <div>
                                                            <input type="text" className="form-control input-bg-color-2 border-0 body-sub-titles" 
                                                                name="streetaddress_apartment" placeholder={placeholderTranslations[locale]['streetaddress_apartment']}
                                                                onChange={handleAppartmentChange}
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
