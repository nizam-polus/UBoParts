import React, { useCallback, useEffect, useState, useRef } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '~/components/shared/AppImage';
import Link from 'next/link';
import SellerSideBar from './SellerSideBar';
import APIs from '~/services/apiService';
import Qrgenerator from './Qrgenerator';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import ReactToPrint from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Create_new_listing() {
    const [error, setError] = useState(null);
    const [makesArray, setMakesArray] = useState<any>([]);
    const [modelArray, setModelArray] = useState<any>([]);
    const [yearArray, setYearArray] = useState<any>([]);
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [licenseplate, setLicenseplate] = useState('');
    const [listName, setListName] = useState('');
    const [listPrice, setListPrice] = useState('');
    const [listQuantity, setListQuantity] = useState('');
    const [listWeight, setListWeight] = useState("")
    const [listArticle, setListArticle] = useState("")
    const [listBarcode, setListBarcode] = useState("");
    const [listDescription, setListDescription] = useState('');
    const [listLocation, setListLocation] = useState('');
    const [productImage, setProductImage] = useState<File | null>(null);
    const [productGalleryImages, setProductGalleryImages] = useState<any>([]);
    const [tempProductGalleryImages, setTempProductGalleryImages] = useState<any>([]);
    const [categoriesDetails, setCategoriesDetails] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Store the selected category ID
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [categoriesData, setCategoriesData] = useState<any>([])
    const [parts, setParts] = useState<any>([]);
    const [inputValue, setInputValue] = useState('');
    const [uname, setUname] = useState("")
    const [uid, setUid] = useState("")
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
    const [carDetailId, setCarDetailId] = useState()
    const [selectedItem, setSelectedItem] = useState(null);
    const [showInvaidLicense, setShowInvaidLicense] = useState(false);
    const [incomplete, setIncomplete] = useState<any>(false);
    const [randomNumber, setRandomNumber] = useState('');
    const [locationNo, setLocationNo] = useState<any>('A1')
    const [locationText, setLocationText] = useState<any>('')
    const [saleArray, setSaleArray] = useState([])
    const [saleOffer, setSaleOffer] = useState(1)
    const [makeName, setMakeName] = useState('')
    const [modelName, setModelName] = useState('')
    const [year, setYear] = useState('')
    const [clicked, setClicked] = useState<boolean>(false)

    const router = useRouter()
    const inputRef: any = useRef()
    const galleryRef: any = useRef()
    const upperCaseListName = listName.toUpperCase();
    const componentRef:any = useRef();

    useEffect(() => {
        let userDetails: any = localStorage.getItem("userdetails")
        const userDetailsJSON = JSON.parse(userDetails);
        const username = userDetailsJSON.username;
        const userid = userDetailsJSON.id;
        setUname(username)
        setUid(userid)
        // Fetch categories data
        APIs.getCategories().then((response) => {
            const categoriesData = response.data.data; // Access the "data" property
            // Extract category names
            const categoryNames = categoriesData.map((category: any) => category.attributes.category_name);
            setCategoriesDetails(categoryNames);
            setCategoriesData(categoriesData); // Set categoriesData state here
        }).catch((error) => {
            setError(error);
        });

        APIs.getCarMake().then((response: any) => {
            setMakesArray(response.data.rows);
        })
            .catch((error) => {
                setError(error);
            });
    }, []);

    useEffect(() => {
        APIs.getSale()
          .then(response => {
            setSaleArray(response.data.data)
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []); 

    const generateRandomNumber = () => {
        const min = 100000000000; 
        const max = 999999999999; 
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber.toString(); 
    };

    const generateRandomNumberAndFetchData = () => {
        const newRandomNumber = generateRandomNumber();
        APIs.getCheckAllProducts(newRandomNumber).then((res) => {
            if (Array.isArray(res.data.data) && res.data.data.length === 0) {
                setRandomNumber(newRandomNumber);
                setListBarcode(newRandomNumber)
            } else {
                generateRandomNumberAndFetchData();
            }
        });
    };

    useEffect(() => {
        generateRandomNumberAndFetchData();
    }, []);

    useEffect(() => {
        if (licenseplate && licenseplate.length > 5) {
            const getData = setTimeout(() => {
                APIs.getCarDetailsUsingLicence(licenseplate).then((response: any) => {
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
    }, [licenseplate]);

    const handleLicenseplateChange = (event: any) => {
        const enteredLicenseplate = event.target.value.toUpperCase();
        setLicenseplate(enteredLicenseplate);

        APIs.getCarDetailsUsingLicence(enteredLicenseplate)
            .then((response) => {
                setCarDetailId(response.data.id);
            })
            .catch((error) => {
                setError(error);
            });

        APIs.getLicenseplate(event.target.value).then((response: any) => {
            // setModelArray(response.data.rows);
        })
            .catch((error) => {
                setError(error);
            });
    };

    const setMakeNameFn = (Id: any) => {
        const selectedMake = makesArray.find((make: any) => make.id == Id);
        if (selectedMake) {
            setMakeName(selectedMake.make);
        }
    }

    const setModelNameFn = (Id: any, modelArray: any) => {
        const selectedModelName = modelArray.find((model: any) => model.id == Id);

        if(selectedModelName){
            setModelName(selectedModelName.model)
        }
    }

    const setYearChangeFn = (Id: any, yearArray: any) => {
        const selectedYearName = yearArray.find((year: any) => year.id == Id);
        if(selectedYearName){
            setYear(selectedYearName.year)
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

    const handleCategoryChange = (event: any) => {
        const selectedCategory = event.target.value;
        setSelectedCategory(selectedCategory);

        // Find the selected category's ID based on its name
        const selectedCategoryData = categoriesData.find(
            (category: any) => category.attributes.category_name === selectedCategory
        );

        if (selectedCategoryData) {
            const selectedCategoryId = selectedCategoryData.id;
            setSelectedCategoryId(selectedCategoryId);
            // Fetch subcategories based on the selected category's ID
            APIs.getSubcategories(selectedCategoryId)
                .then((response) => {
                    // Extract subcategory data
                    const subcategoryData = response.data.rows;
                    setSubcategories(subcategoryData);
                    // Reset the selected subcategory ID to an empty string when the category changes
                    setSelectedSubcategoryId(""); // This line resets the selected subcategory ID
                    // You can optionally select the first subcategory by default if needed
                    if (subcategoryData.length > 0) {
                        setSelectedSubcategoryId(subcategoryData[0].id);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching subcategories:', error);
                });
        }
    };
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            APIs.getParts(inputValue).then((res) => {
                setParts(res.data.data);
            });
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [inputValue])

    const handleListChange = (event: any) => {
        setInputValue(event.target.value.toUpperCase())
        setListName(event?.target.value.toUpperCase())
    };

    const handlePartSelect = (partName: any) => {
        // Update the listName state with the selected part
        setSelectedItem(partName);
        setListName(partName);
        setInputValue(partName);
    };

    const handlePriceChange = (event: any) => {
        const newValue = event.target.value.replace(/[^0-9.]/g, ''); 
        if (newValue !== event.target.value) {
            event.target.value = newValue;
        }
        setListPrice(newValue)
    }

    const handleQuantityChange = (event: any) => {
        const newValue = event.target.value.replace(/[^0-9.]/g, ''); 
        if (newValue !== event.target.value) {
            event.target.value = newValue;
        }
        setListQuantity(newValue)
    }

    const handleWeightChange = (event: any) =>{
        const newValue = event.target.value.replace(/[^0-9.]/g, ''); 
        if (newValue !== event.target.value) {
            event.target.value = newValue;
        }
        setListWeight(newValue) 
    }

    const handleLocationNoChange = (event: any) => {
        setLocationNo(event.target.value)
        setListLocation( event.target.value + '.' + locationText);
    }
    const handleLocationChange = (event: any) => {
        const newValue = event.target.value.replace(/[^0-9.]/g, ''); 
        setLocationText(newValue)
        if (newValue !== event.target.value) {
            event.target.value = newValue;
        }
        setListLocation( locationNo + '.' + newValue);
    }

    const handleSaleChange = (event : any) =>{
        setSaleOffer(event.target.value)
    }

    const handleArticleChange = (event: any) => {
        setListArticle(event.target.value)
    }

    const handleDescriptionChange = (event: any) => {
        setListDescription(event.target.value)
    }

    const handleFeaturedImageChange = (event: any) => {
        const file = event.target.files[0];
            setProductImage(file);
            setTempProductGalleryImages([file,...productGalleryImages])
    }; 

    const handleGalleryImagesChange = (event: any) => {
        const files = event.target.files;
        const selectedImages = [...productGalleryImages]; 
        for (let i = 0; i < files?.length; i++) {
            selectedImages.push(files[i]);
        }
        setProductGalleryImages(selectedImages); 
        setTempProductGalleryImages([productImage, ...selectedImages])
    };

    const handleDeleteFeaturedImage = () => {
        tempProductGalleryImages.shift()
        setProductImage(null);
        inputRef.current.value = ''
    };

    const handleDeleteGalleryImage = (index: any) => {
        const updatedGalleryImages = [...productGalleryImages];
        const updatedTempGalleryImages = [...tempProductGalleryImages]
        updatedGalleryImages.splice(index, 1);
        setProductGalleryImages(updatedGalleryImages);
        updatedTempGalleryImages.splice(index, 1);
        setTempProductGalleryImages(updatedTempGalleryImages);

        if(index == 0){
            setProductImage(null)
            inputRef.current.value = ''
            galleryRef.current.value = ''
            setTempProductGalleryImages([])
            setProductGalleryImages([])
        }
    };

    const createNewList = () => {
        setClicked(true)
        let incomplete = !(!!listName && !! productImage && !!selectedCategoryId  && !!selectedMake  && !!selectedModel  && !!selectedYear  && !!listPrice && !!listQuantity && !!listLocation && !!listArticle && !!listBarcode && !!listDescription && !!uname && !!uid)
        setIncomplete(incomplete);
        if (!incomplete) {
            if (!parts.length) {
                APIs.setParts({
                    "data": {
                        "part": listName,
                        "lang": "EN"
                    }
                }).then((res) => console.log(res))
            }
            const requestData: any = {
                "data": {
                    "title": listName,
                    "cardetail": [],
                    "make": [Number(selectedMake)],
                    "model": [Number(selectedModel)],
                    "year": [Number(selectedYear)],
                    "category": [selectedCategoryId],
                    "price": listPrice,
                    "stock_count": [listQuantity],
                    "product_weight": listWeight,
                    "product_location_warehouse": listLocation,
                    "article_number": listArticle,
                    "part_no_barcode_no": listBarcode,
                    "description": listDescription,
                    "sale": saleOffer,
                    "product_status": "Active",
                    "seller": uname,
                    "seller_id": uid,
                }
            };
            
            if (selectedSubcategoryId) {
                requestData.data.sub_category = [parseInt(selectedSubcategoryId)];
            }
            if(saleOffer){
                requestData.data.sale = saleOffer
            }
            APIs.createNewList(requestData)
                .then((response: any) => {
                    const resId = response.data.data.id;
                    const uploadPromises = [];

                    if (productImage && productImage instanceof File) {
                        // Make the API call to upload the featured image
                        uploadPromises.push(
                            APIs.uploadImage({
                                ref: "api::product.product",
                                refId: resId,
                                field: "product_image",
                                files: productImage,
                            })
                        );

                        for (let i = 0; i < productGalleryImages.length; i++) {
                            const galleryImage = productGalleryImages[i];
                            // Use a closure to capture the current value of 'i'
                            (function (index) {
                                uploadPromises.push(
                                    APIs.uploadImage({
                                        ref: "api::product.product",
                                        refId: resId,
                                        field: "product_gallary_image",
                                        files: galleryImage,
                                    }).catch((galleryImageUploadError) => {
                                        console.error(`Gallery image ${index + 1} upload error:`, galleryImageUploadError);
                                    })
                                );
                            })(i);
                        }
                    } else {
                        // Handle the case where productImage is not defined
                        console.error("No product image selected.");
                        setClicked(false)
                    }

                    // Wait for all image upload promises to complete
                    return Promise.all(uploadPromises);
                })
                .then(() => {
                    // All images have been uploaded, now you can navigate to the new page
                    router.push('/seller/listings');
                    setClicked(false)
                })
                .catch((error) => {
                    console.log(error);
                    setError(error);
                    setClicked(false)
                });
        } else {
            toast.error("Fill all fields for create new list")
            setClicked(false)
        }
    }

    const printBarcode = () =>{
        const input = componentRef.current;
        if (input) {
          const mainPdf = new jsPDF('landscape', 'in', [4, 2], true);
          html2canvas(input, { logging: true, allowTaint: false, useCORS: true, onclone: function (clonedDoc: any) {
           } }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            mainPdf.addImage(imgData, 'PNG', 0, 0, 4 , 2 );
            const pdfBlob = mainPdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const newWindow : any= window.open(pdfUrl, '_blank', 'width=600,height=800');
            newWindow.print();
            newWindow.onafterprint = function () {
              newWindow.close();
            };
          });
        }
    }
    return (
        <>
            <div className="main-body pb-2 mb-5">
                <div className="container">
                    <section className="quote-wrapper mt-5">
                        <div className="row mt-3 g-4">
                            <SellerSideBar />
                            <div className="col-12 col-md-9 p-0 p-sm-3">
                                <div className="coulmn-bg-color-1 rounded">
                                    <div className="table-responsive pt-3 pb-3 overflow-hidden">
                                        <table className="table profile-table-1 coulmn-bg-color-1 rounded">
                                            <tbody className="double">
                                                <tr>
                                                    <th colSpan={2} 
                                                        className="px-5 pb-1 ps-0 custom-color-3  regularfont body-sub-titles border-bottom border-top-0">
                                                         <FormattedMessage id="CREATE_NEW_LISTING"/>
                                                    </th>
                                                </tr>
                                                <tr className="double">
                                                    <td className='px-5 pt-4 pb-4'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">
                                                            <FormattedMessage id="LIST_NAME" />
                                                            <span className="required">*</span>
                                                        </label>
                                                        <input type="text" value={inputValue} onChange={handleListChange} 
                                                        className={`form-control input-bg-color-2 border-0 products-name custom-color-2 ${incomplete && !listName 
                                                        ? 
                                                        'required-field' 
                                                        : 
                                                        'border-0'}`} name="first-name" placeholder="24 Inch Tyre for Mustang" required />
                                                        <ul style={{ display: "contents" }}>
                                                            {parts.length > 0 && inputValue.length >= 2 && !selectedItem && (

                                                                <div className="options-container  position-absolute" 
                                                                    style={{ backgroundColor: "#ebebeb", boxShadow: "1px 0px 7px 0px grey", zIndex: 3, maxHeight: "200px", overflowY: "scroll", overflowX: "hidden", width: "20rem" }}>
                                                                    {parts
                                                                        .filter((part: any) => part.attributes.parts.toLowerCase().includes(inputValue.toLowerCase()))
                                                                        .map((part: any) => (
                                                                            <li
                                                                                className='options'
                                                                                style={{ border: "0px solid grey", listStyle: "none", padding: "4px 10px", fontSize: "14px" }}
                                                                                key={part.id}
                                                                                onClick={() => handlePartSelect(part.attributes.parts)}
                                                                            >
                                                                                {part.attributes.parts}
                                                                            </li>
                                                                        ))}
                                                                </div>
                                                            )}
                                                        </ul>
                                                    </td>
                                                    <td className='px-5 pt-4 pb-4'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">
                                                            <FormattedMessage id="PLATE_NUMBER" />
                                                        </label>
                                                        <input type="text" onChange={handleLicenseplateChange} 
                                                            className={`form-control input-bg-color-2 border-0 products-name custom-color-2 `} 
                                                            name="last-name" placeholder="Enter Plate Number to Auto Fill form" />
                                                        {showInvaidLicense &&
                                                            <div className="row mt-2 ml-2" >
                                                                <span className="advanced_search placeholderfontsize regularfont">No Record Found Against this Plate Number!</span>
                                                            </div>
                                                        }
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td className='px-5 pt-4 pb-2'>
                                                        <label className={`custom-color-2 regularfont products-name pb-2 ${incomplete && !selectedMake ? 'required-field' : 'border-0'}`}>
                                                            <FormattedMessage id="LISTING_MAKE" />
                                                            <span className="required">*</span>
                                                        </label><br />
                                                        <select className="form-select input-bg-color-2 border-0 products-name custom-color-2" name="make" id="makeOption"
                                                            value={selectedMake} onChange={handleMakeChange}>
                                                            <option value="" disabled={true}>Select Make</option>
                                                            {makesArray && makesArray.map((make: any, index: any) => (
                                                                <option key={index} value={make.id}>{make.make}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className='px-5 pt-4 pb-2'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">
                                                            <FormattedMessage id="LISTING_MODEL" />
                                                             <span 
                                                            className="required">*</span></label><br />
                                                        <select disabled={!selectedMake} className={`form-select input-bg-color-2 border-0 products-name custom-color-2 ${incomplete && !selectedModel ? 'required-field' : 'border-0'}`} name="model" id="modelOption"
                                                            value={selectedModel} onChange={handleModelChange}>
                                                            <option value="" disabled={!selectedMake}>Select Model</option>
                                                            {modelArray && modelArray.map((model: any, index: any) => (
                                                                <option key={index} value={model.id}>{model.model}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td className='px-5 pb-2 border-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">
                                                            <FormattedMessage id="LISTING_YEAR" />
                                                            <span className="required">*</span></label><br />
                                                        <select disabled={!selectedModel || (yearArray && yearArray.length && !yearArray[0].year)} 
                                                            className={`form-select input-bg-color-2 border-0 products-name custom-color-2 ${incomplete && !selectedYear ? 'required-field' : 'border-0'}`} 
                                                            name="year" id="yearOption"
                                                            value={selectedYear} onChange={handleYearChange}>
                                                            <option value="" disabled={!selectedModel}>Select Year</option>
                                                            {yearArray && yearArray.map((year: any, index: any) => (
                                                                <option key={index} value={year.id}>{year.year}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td className='px-5 pb-2 border-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">
                                                        <FormattedMessage id="LISTING_CATEGORY" /> 
                                                            <span 
                                                            className="required">*
                                                            </span>
                                                        </label><br />
                                                        <select className={`form-select input-bg-color-2 border-0 products-name custom-color-2 ${incomplete && !selectedCategory ? 'required-field' : 'border-0'}`}  
                                                            value={selectedCategory} onChange={handleCategoryChange}
                                                        >
                                                            <option value="" disabled={!!categoriesDetails}>Choose Category</option>
                                                            {categoriesDetails && categoriesDetails.map((category: any, index: any) => (
                                                                <option key={index} value={category}>{category}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td colSpan={2} className='px-5 pb-4 border-top-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">
                                                        <FormattedMessage id="LISTING_SUBCATEGORY"/>
                                                        </label>
                                                        <br />
                                                        <select
                                                            className="form-select input-bg-color-2 border-0 products-name custom-color-2"
                                                            value={selectedSubcategoryId}
                                                            onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                                                            disabled={!subcategories || subcategories.length === 0}
                                                        >
                                                            <option value="">Choose Sub Category</option>
                                                            {subcategories &&
                                                                subcategories.map((subcategory: any, index: any) => (
                                                                    <option key={index} value={subcategory.id}>
                                                                        {subcategory.name}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td className='px-5 pb-2 pt-4'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">
                                                        <FormattedMessage id="LISTING_PRICE"/>
                                                        <span className="required">*</span></label>
                                                        <input type="text" onChange={handlePriceChange} value={listPrice} 
                                                            className={`form-control input-bg-color-2 border-0 products-name custom-color-2 
                                                            ${incomplete && !listPrice ? 'required-field' : 'border-0'}`} 
                                                            placeholder="Listing Price (€)"
                                                         />
                                                    </td>
                                                    <td className='px-5 pb-2 pt-4'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">
                                                            <FormattedMessage id="LISTING_QUANTITY" />
                                                            <span className="required">*</span></label>
                                                        <input type="text" onChange={handleQuantityChange} 
                                                            className={`form-control input-bg-color-2 border-0 products-name custom-color-2 ${incomplete && !listQuantity ? 'required-field' : 'border-0'}`}
                                                            placeholder="Listing Quantity"
                                                            value={listQuantity}
                                                            onKeyPress={(e: any) => {
                                                                if (e.key === '0' && e.target.value === '') {
                                                                    e.preventDefault();
                                                                }
                                                            }} 
                                                        />
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td className='px-5 pb-2 pt-4'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">
                                                            <FormattedMessage id="WEIGHT_IN_KG"/> 
                                                            <span className="required">*</span>
                                                        </label>
                                                        <input type="text" onChange={handleWeightChange}
                                                            className={`form-control input-bg-color-2 border-0 products-name custom-color-2 ${incomplete && !listWeight ? 'required-field' : 'border-0'}`}
                                                            placeholder="weight in KG"
                                                        />
                                                    </td>
                                                    <td className='px-5 pb-2 pt-4'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">
                                                        <FormattedMessage id="ARTICLE_NUMBER"/>
                                                            <span className="required">*</span>
                                                        </label>
                                                        <input type="text" onChange={handleArticleChange} 
                                                            className={`form-control input-bg-color-2 border-0 products-name custom-color-2 ${incomplete && !listArticle ? 'required-field' : 'border-0'}`}
                                                            placeholder="Article No" 
                                                        />
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td className='px-5 pb-2 border-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">
                                                        <FormattedMessage id="ON_SALE"/>
                                                        </label><br />
                                                        <select className="form-select input-bg-color-2 border-0 products-name custom-color-2"
                                                            value={saleOffer} onChange={handleSaleChange}>
                                                                {saleArray && saleArray.map((sale: any) => (
                                                                <option key={sale.id} value={sale.id}>{sale.attributes.discount}</option>))}
                                                        </select>  
                                                    </td>
                                                    <td className='px-5 pb-2 border-0 d-flex' style={{ gap: "10px" }}>
                                                        <div style={{width: "40%"}}>
                                                            <label className="custom-color-2 regularfont products-name pb-2">
                                                            <FormattedMessage id="LOCATION_OF_PART_NO"/>
                                                            </label>
                                                            <select className="form-select input-bg-color-2 border-0 products-name custom-color-2"
                                                                name='locationNo' value={locationNo} onChange={handleLocationNoChange}>
                                                                <option value="A1">A1</option>
                                                                <option value="A2">A2</option>
                                                                <option value="A3">A3</option>
                                                                <option value="A4">A4</option>
                                                                <option value="A5">A5</option>
                                                                <option value="A6">A6</option>
                                                                <option value="A7">A7</option>
                                                                <option value="A8">A8</option>
                                                                <option value="A9">A9</option>
                                                            </select>
                                                        </div>
                                                        <div style={{width: "60%"}}>
                                                            <label className="custom-color-2 regularfont products-name pb-2">
                                                                <FormattedMessage id="LOCATION_OF_PART"/>
                                                                <span className="required">*</span>
                                                            </label>
                                                            <input type="text" onChange={handleLocationChange} 
                                                                className={`form-control input-bg-color-2 border-0 products-name custom-color-2 ${incomplete && !locationNo ? 'required-field' : 'border-0'}`} 
                                                                style={{height: "2.3rem"}} placeholder="Location of Part" 
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2} className='px-5 pb-4 pt-2 border-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Barcode :</label>
                                                            <div className='d-flex align-items-center justify-content-center flex-column ubo-barcode-container'
                                                                ref={componentRef}
                                                                >
                                                                <div className="details d-flex flex-column flex-sm-row" style={{ width: "100%", fontWeight: "bolder", padding: "0px 10px 0 10px", fontSize: "14px" }}>
                                                                    <div className='d-flex justify-content-between' style={{ minWidth: "180px" }}>
                                                                        {listBarcode && <Qrgenerator qrValue={listBarcode} />}
                                                                    </div>
                                                                    <div className='d-flex flex-column w-100'>
                                                                        <div>
                                                                            <div>UBOPARTS</div>
                                                                            <div>{upperCaseListName}</div>
                                                                        </div>
                                                                        <div style={{ minWidth: "110px" }}>
                                                                            <div>REK NUMMER : {listLocation}</div>
                                                                            {/* <div> {productData?.attributes?.product_location_warehouse}</div> */}
                                                                        </div>
                                                                        <div>ARTICLE NO : {listArticle}</div>
                                                                        <div>{makeName} {modelName} {year} </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        <div>
                                                            {/* <ReactToPrint
                                                                pageStyle={`
                                                                @page {
                                                                    size: landscape;
                                                                    margin: 0;
                                                                    -webkit-transform: rotate(90deg);
                                                                    -moz-transform: rotate(90deg);
                                                                    -o-transform: rotate(90deg);
                                                                    -ms-transform: rotate(90deg);
                                                                    transform: rotate(90deg);
                                                                }
                                                                @media print {
                                                                body {
                                                                width: 11cm;
                                                                height: 5cm;
                                                                -webkit-transform: rotate(90deg);
                                                                    -moz-transform: rotate(90deg);
                                                                    -o-transform: rotate(90deg);
                                                                    -ms-transform: rotate(90deg);
                                                                    transform: rotate(90deg);
                                                                    }
                                                                }
                                                                `}
                                                                trigger={() => (

                                                                    <button
                                                                        type="button"
                                                                        className="edit rounded button-bg-color-1 text-white boldfont mini-text-1 custom-border-2 p-2 my-2 ubo-btn-custom"
                                                                        >
                                                                        Print
                                                                    </button>
                                                                )}
                                                                content={() => componentRef.current}
                                                            /> */}
                                                            
                                                            <button
                                                            onClick={printBarcode}
                                                                type="button"
                                                                className="edit rounded button-bg-color-1 text-white boldfont mini-text-1 custom-border-2 p-2 my-2 ubo-btn-custom"
                                                            >
                                                                Print
                                                            </button>
                                                        </div>
                                                        {/* <div><button onClick={printBarcode}>print</button></div> */}
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td className='px-5 pt-4 pb-2'>
                                                        <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="LISTING_FEATURED_IMAGE" /> <span className="required">*</span></label>
                                                        <input className={`form-control pt-2 pb-1 choosefile ${incomplete && !productImage ? 'required-field' : 'border-0'}`} 
                                                        type="file" id="featuredImages" ref={inputRef} onChange={handleFeaturedImageChange}  required />
                                                        {productImage && (
                                                            <div className="selected-featured-image" style={{ position: "relative", padding: "10px 0", width: "200px" }}>
                                                                <button style={{ position: 'absolute', top: '10px', right: '15px', border: "none", color: "white", backgroundColor: "transparent", padding: "5px", borderRadius: "50%", cursor: "pointer" }}
                                                                 onClick={() => handleDeleteFeaturedImage()}>
                                                                    <i className='fa fa-trash'></i>
                                                                </button>
                                                                <img src={URL.createObjectURL(productImage)} alt="Selected Featured" width={200} height={200} style={{ borderRadius: "20px" }} />
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className='px-5 pt-4 pb-2'>
                                                        <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="LISTING_IMAGES" /></label>
                                                        <input className={`form-control pt-2 pb-1 choosefile `} type="file"
                                                         id="galleryImages" ref={galleryRef} onChange={handleGalleryImagesChange}
                                                         disabled={!productImage} multiple />
                                                        {tempProductGalleryImages.length > 0 && (
                                                            <div className="selected-gallery-images" style={{ padding: "10px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                                                {tempProductGalleryImages.map((image: any, index: any) => (
                                                                    <div key={index} style={{ position: 'relative' }}>
                                                                        <img src={URL.createObjectURL(image)} alt={`Selected ${index + 1}`} height={200} style={{ width: "100%", borderRadius: "20px", maxWidth: "210px" }} />
                                                                        <button style={{ position: 'absolute', top: '5px', right: '10px', border: "none", color: "white", background: "none" }}
                                                                         onClick={() => handleDeleteGalleryImage(index)}>
                                                                            <i className='fa fa-trash mr-3'></i>
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </td >
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2} className='px-5 pb-2 border-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="Listing_Description" />
                                                            <span className="required"> *</span>
                                                        </label>
                                                        <textarea onChange={handleDescriptionChange} 
                                                            className={`form-control input-bg-color-2 border-0 products-name rounded 
                                                            ${incomplete && !listDescription ? 'required-field' : 'border-0'}`} rows={4}
                                                            required
                                                        >
                                                        </textarea>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2} className="border-0 px-5">
                                                        {clicked ? <button type="submit" disabled
                                                        className="place-quote text-white mediumfont products-name rounded border-0 button-bg-color-1 ubo-btn-custom">Creating....</button>
                                                        :
                                                        <button type="submit" onClick={createNewList} 
                                                        className="place-quote text-white mediumfont products-name rounded border-0 button-bg-color-1 ubo-btn-custom"><FormattedMessage id="CREATE_LISTING" /></button>
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
export default Create_new_listing;