import React, { useCallback, useEffect, useState, useRef } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '~/components/shared/AppImage';
import Link from 'next/link';
import SellerSideBar from './SellerSideBar';
import APIs from '~/services/apiService';
import { useRouter } from 'next/router';
import { BASE_URL } from 'configuration';
import { toast } from 'react-toastify';
import Qrgenerator from './Qrgenerator';
import ReactToPrint from 'react-to-print';
import { FormattedMessage } from 'react-intl';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function EditListing() {
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
    const [listArticle, setListArticle] = useState("")
    const [listBarcode, setListBarcode] = useState("");
    const [listDescription, setListDescription] = useState('');
    const [listLocation, setListLocation] = useState('');
    const [productImage, setProductImage] = useState<File | null>(null);
    const [productGalleryImages, setProductGalleryImages] = useState<any>([]);
    const [categoriesDetails, setCategoriesDetails] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState(0); // Store the selected category ID
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [categoriesData, setCategoriesData] = useState<any>([])
    const [parts, setParts] = useState<any>([]);
    const [inputValue, setInputValue] = useState('');
    const [uname, setUname] = useState("")
    const [uid, setUid] = useState("")
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
    const [carDetailId, setCarDetailId] = useState()
    const [selectedItem, setSelectedItem] = useState(null);
    const [showInvaidLicense, setShowInvaidLicense] = useState(false);
    const [saleArray, setSaleArray] = useState([])
    const [saleOffer, setSaleOffer] = useState('')
    const [incomplete, setIncomplete] = useState<any>(false);
    const [makeName, setMakeName] = useState('')
    const [modelName, setModelName] = useState('')
    const [year, setYear] = useState('')
    const [locationNo, setLocationNo] = useState<any>('A2')
    const [locationText, setLocationText] = useState<any>("")
    const [clicked, setClicked] = useState(false)

    const router = useRouter()
    const id = router.query.id;
    const [productData, setProductData] = useState<any>({})
    const inputRef: any = useRef()
    const galleryRef: any = useRef()
    const componentRef:any = useRef();

    let locale: any;
    
    if(typeof window !== 'undefined'){
        locale = localStorage.getItem("locale")
    }

    const placeholderTranslations : any = {
        nl: {
            listName: "24 Inch Band voor Mustang",
            plate_number: 'Voer het kenteken in om het formulier automatisch in te vullen',
            price: 'Lijstprijs (€)',
            quantity: 'Aantal vermeldingen',
            weight: 'Gewicht in KG',
            article: 'Artikelnummer',
            location: 'Locatie van onderdeel',
            description: 'Omschrijving',
            type: "Typ hier..."
        },
        en: {
            listName: "24 Inch Tyre for Mustang",
            plate_number: 'Enter Plate Number to Auto Fill form',
            price: 'Listing Price (€)',
            quantity: 'Listing Quantity',
            weight: 'weight in KG',
            article: 'Article No',
            location: 'Location of Part',
            description: 'Description',
            type: "Type here..."
        }
    };
 
    useEffect(() => {
      let userDetails: any = localStorage.getItem("userdetails")
      const userDetailsJSON = JSON.parse(userDetails);
      const username = userDetailsJSON.username;
      const userid = userDetailsJSON.id;
      setUname(username)
      setUid(userid)
      
      APIs.getCategories()
      .then((response) => {
        const categoriesData = response.data.data; 
        const categoryNames = categoriesData.map((category: any) => ( 
        {
          name: category.attributes.category_name,
          name_nl: category.attributes.category_name_nl ? category.attributes.category_name_nl : category.attributes.category_name
      }));
        setCategoriesDetails(categoryNames);
        setCategoriesData(categoriesData); 
      }).catch((error) => {
        setError(error);
      });
      APIs.getCarMake().then((response: any) => {
          setMakesArray(response.data.rows);
          getCardetails();
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
          toast.error("Error fetching sale offers")
        });
    }, []); 

  const getCardetails = () => {
    APIs.getProduct(id).then(response => {
      let product = response.data.data;
      if (response.data.data.attributes?.product_gallary_image?.data?.length > 0 && response.data.data.attributes?.product_image.data == null) {
        let productImage = response.data.data.attributes?.product_gallary_image?.data[0]?.attributes?.url;
        setProductImage(productImage);
      } else {
        let productImage = response.data.data.attributes?.product_image?.data.attributes.url
        setProductImage(productImage);
      }
      let productGallery = response.data.data.attributes?.product_gallary_image?.data;
      let make = response.data.data.attributes?.make?.data?.id
      setMakeName(response.data.data.attributes.make?.data?.attributes.make_name)
      let model = response.data.data.attributes?.model?.data?.id
      setModelName(response.data.data.attributes.model?.data?.attributes.model_name)
      let year = response.data.data.attributes?.year?.data?.id
      setYear(response.data.data.attributes.year?.data?.attributes.year)
      let licenseplate = response.data.data?.attributes?.cardetail?.data?.attributes?.licenseplate
      setProductData(product);
      setProductGalleryImages(productGallery);
      setListName(response.data.data.attributes.title)
      setLicenseplate(response.data.data.attributes.platenumber)
      setListPrice(response.data.data.attributes.price)
      setListQuantity(response.data.data.attributes.stock_count)
      setListLocation(response.data.data.attributes.product_location_warehouse)
      setListArticle(response.data.data.attributes.article_number)
      setListBarcode(response.data.data.attributes.part_no_barcode_no)
      setListDescription(response.data.data.attributes.description)
      setSelectedCategory(response.data.data.attributes.category.data.attributes.category_name)
      setSelectedCategoryId(response.data.data.attributes.category.data.id)
      setSelectedSubcategoryId(response.data.data.attributes.sub_category.data.id)
      setSelectedSubcategory(response.data.data.attributes.sub_category.data.attributes.name)
      setSaleOffer(response.data.data.attributes.sale.data.id)
      setLocationNo(response.data.data.attributes.product_location_warehouse.slice(0,2))
      setLocationText(response.data.data.attributes.product_location_warehouse.slice(3))
      APIs.getSubcategories(response.data.data.attributes.category.data.id)
        .then((response) => {
          const subcategoryData = response.data.rows;
          setSubcategories(subcategoryData);
          const initialSubcategory: any = subcategories.find(
            (subcategory: any) => subcategory.category_id === selectedSubcategoryId
          );
          if (initialSubcategory) {
            setSelectedSubcategoryId(initialSubcategory.id);
          }
          setSelectedMake(make)
          getModel(make)
          setSelectedModel(model)
          getYear(model)
          setSelectedYear(year)
          setLicenseplate(licenseplate)
        })
    }).catch(err => console.log(err))
  }

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
      Number(makeId)
      APIs.getCarModel(makeId).then((response: any) => {
          setModelArray(response.data.rows);
      })
          .catch((error) => {
              setError(error);
          });
    }

    const getYear = ( modelId: any) => {
    
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
      getYear(event.target.value);
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
      const selectedCategoryData = categoriesData.find(
        (category: any) => category.attributes.category_name === selectedCategory
      );
      
      if (selectedCategoryData) {
          const selectedCategoryId = selectedCategoryData.id;
          setSelectedCategoryId(selectedCategoryId);
          APIs.getSubcategories(selectedCategoryId)
            .then((response) => {
              const subcategoryData = response.data.rows;
              setSubcategories(subcategoryData);
              setSelectedSubcategoryId(""); 
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
    const handleArticleChange = (event: any) => {
      setListArticle(event.target.value)
    }

    const handleSaleChange = (event : any) =>{
      setSaleOffer(event.target.value)
  }

    const handleDescriptionChange = (event: any) => {
        setListDescription(event.target.value)
    }

    const handleFeaturedImageChange = (event: any) => {
      const file = event.target.files[0];
        setProductImage(file);
        // setTempProductGalleryImages([file])
    }; 

    const handleGalleryImagesChange = (event: any) => {
      const files = event.target.files;
      let selectedImages: any = []
      if(productGalleryImages){

         selectedImages = [...productGalleryImages];
      }
      for (let i = 0; i < files?.length; i++) {
        APIs.uploadImage({
          ref: "api::product.product",
          refId: id,
          field: "product_gallary_image",
          files: files[i],
      }).then((res: any) => {
        let newImage = { attributes: { url: res.data[0].url } };
        selectedImages.push(newImage)
      }).then(() =>{
        setProductGalleryImages(selectedImages)
      }).catch((galleryImageUploadError) => {
          console.error(`Gallery image  upload error:`, galleryImageUploadError);
      })
      }  
    }

    const handleDeleteFeaturedImage = () => {
        setProductImage(null);
        inputRef.current.value = ''
    };

    const handleDeleteGalleryImage = (idofImage: any, index: any) => {
      APIs.deleteImage(idofImage).then((res: any) => {
      const updatedGalleryImages = [...productGalleryImages];
      updatedGalleryImages.splice(index, 1);
      setProductGalleryImages(updatedGalleryImages);
    }).catch((galleryImageUploadError) => {
        console.error(`Gallery image  upload error:`, galleryImageUploadError);
    })
    };
    const createNewList = () => {
      setClicked(true)
      let incomplete = !(!!listName  && !!productImage && !!selectedMake  && !!selectedModel  && !!selectedYear && !!selectedCategoryId  && !!listPrice && !!listQuantity && !!listArticle &&listLocation && !!listBarcode && !!listDescription && !!uname && !!uid)
      setIncomplete(incomplete);
        if(!incomplete){
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
              "platenumber": licenseplate,
              "make": [Number(selectedMake)],
              "model": [Number(selectedModel)],
              "year": [Number(selectedYear)],
              "category": [selectedCategoryId],
              "price": listPrice,
              "stock_count": [listQuantity],
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
          APIs.updateList(id, requestData).then((response: any) => {
            const resId = response.data.data.id;
            const uploadPromises = [];

            if (productImage && productImage instanceof File) {
                uploadPromises.push(
                    APIs.uploadImage({
                        ref: "api::product.product",
                        refId: resId,
                        field: "product_image",
                        files: productImage,
                    })
                );    
            } else {
                console.error("No product image selected.");
                setClicked(false)
            }
            return Promise.all(uploadPromises);

          }).then(() => router.push('/seller/listings'))
          .catch((error) => {
            setClicked(false)
            console.log(error);
            setError(error);
          });
        }else{
          toast.error(()=>(<FormattedMessage id="FILL_ALL_EDIT" />))
          setClicked(false)
        }
    }

    const printBarcode = () =>{
      const input = componentRef.current;
      if (input) {
        const mainPdf = new jsPDF('landscape', 'in', [4.33, 2], true);
        html2canvas(input, { logging: true, allowTaint: false, useCORS: true, onclone: function (clonedDoc: any) {
         } }).then((canvas: any) => {
          const imgData = canvas.toDataURL('image/png');
          mainPdf.addImage(imgData, 'PNG', 0, 0, 4.33, 2 );
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
                                           {
                                            locale && 
                                            <tbody className="double">
                                            <tr>
                                                <th colSpan={2} 
                                                className="px-5 pb-1 ps-0 custom-color-3  regularfont body-sub-titles border-bottom border-top-0"
                                                >
                                                  <FormattedMessage id="EDIT_LIST" />
                                                </th>
                                            </tr>
                                            <tr className="double">
                                            <td className='px-5 pt-4 pb-4'>
                                                <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="LIST_NAME" /> <span className="required">*</span></label>
                                                <input type="text" value={listName} onChange={handleListChange} 
                                                  className={`form-control input-bg-color-2 border-0 products-name custom-color-2 ${incomplete && !listName ? 'required-field' : 'border-0' }`}
                                                  name="first-name" 
                                                  placeholder={placeholderTranslations[locale]['listName']} 
                                                  required/>
                                                
                                                <ul style={{display: "contents"}}>
                                                        {parts.length > 0 && inputValue.length >= 2 && !selectedItem && (
                                                            <ul style={{ display: "contents" }}>
                                                                <div className="options-container  position-absolute" 
                                                                  style={{ backgroundColor: "#ebebeb", boxShadow: "1px 0px 7px 0px grey", zIndex: 3, maxHeight: "200px", overflowY: "scroll", overflowX: "hidden", width: "22rem" }}>
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
                                                            </ul>
                                                        )}
                                                 
                                                </ul>
                                              </td>
                                                <td className='px-5 pt-4 pb-4'>
                                                    <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="PLATE_NUMBER" /></label>
                                                    <input type="text" value={licenseplate} 
                                                      onChange={handleLicenseplateChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" 
                                                      name="last-name" 
                                                      placeholder={placeholderTranslations[locale]['plate_number']} 
                                                      required
                                                    />
                                                    {showInvaidLicense &&
                                                <div className="row mt-2 ml-2" >
                                                    <span className="advanced_search placeholderfontsize regularfont"><FormattedMessage id="NO_RECORD_FOUND"/></span>
                                                </div>
                                            }
                                                </td>
                                            </tr>
                                            <tr className="double">
                                                <td className='px-5 pt-4 pb-2'>
                                                    <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="LISTING_MAKE" /> <span className="required">*</span></label><br />
                                                    <select className="form-select input-bg-color-2 border-0 products-name custom-color-2" name="make" id="makeOption"
                                                        value={selectedMake} onChange={handleMakeChange}>
                                                        <option value="" disabled={true}>{locale == "nl" ? "Selecteer merk" : "Select Make"}</option>
                                                        {makesArray && makesArray.map((make: any, index: any) => (
                                                            <option key={index} value={make.id}>{make.make}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className='px-5 pt-4 pb-2'>
                                                    <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="LISTING_MODEL" /> <span className="required">*</span></label><br />
                                                    <select disabled={!selectedMake} 
                                                      className="form-select input-bg-color-2 border-0 products-name custom-color-2" 
                                                      name="model" id="modelOption"
                                                      value={selectedModel} onChange={handleModelChange}
                                                    >
                                                      <option value="" disabled={true}>{locale == "nl"? "Selecteer Model" : "Select Model"}</option>
                                                        {modelArray && modelArray.map((model: any, index: any) => (
                                                            <option key={index} value={model.id}>{model.model}
                                                      </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="double">
                                                <td className='px-5 pb-2 border-0'>
                                                    <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="LISTING_YEAR" /> <span className="required">*</span></label><br/>
                                                    <select disabled={!selectedModel || (yearArray && yearArray.length && !yearArray[0].year)} 
                                                        className="form-select input-bg-color-2 border-0 products-name custom-color-2" name="year" id="yearOption"
                                                        value={selectedYear} onChange={handleYearChange}>
                                                        <option value="" disabled={true}>{locale == "nl"? "Selecteer Jaar" : "Select Year"}</option>
                                                        {yearArray && yearArray.map((year: any, index: any) => (
                                                        <option key={index} value={year.id}>{year.year}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="single">
                                                <td className='px-5 pb-2 border-0'>
                                                    <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="LISTING_CATEGORY" /> <span className="required">*</span></label><br />
                                                    <select className="form-select input-bg-color-2 border-0 products-name custom-color-2"  
                                                      value={selectedCategory} onChange={handleCategoryChange}>
                                                        <option value="" disabled={!!categoriesDetails}>{locale == "nl" ? "Selecteer categorie": "Select category"}</option>
                                                        {categoriesDetails && categoriesDetails.map((category: any, index: any) => (
                                                        <option key={index} value={category.name}>{locale == "nl" && category.name_nl ? category.name_nl : category.name}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td colSpan={2} className='px-5 pb-4 border-top-0'>
                                                    <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="LISTING_SUBCATEGORY" /></label><br />
                                                    <select
                                               className="form-select input-bg-color-2 border-0 products-name custom-color-2"
                                               value={selectedSubcategoryId} // Use selectedSubcategoryId to store the ID
                                               onChange={(e) => setSelectedSubcategoryId(e.target.value)} // Update the selected subcategory ID
                                               disabled={!subcategories || subcategories.length === 0}
                                             >
                                             <option>{locale == "nl" ? "Selecteer subcategorie": "Select subcategory"}</option>
                                             {subcategories &&
                                               subcategories.map((subcategory: any, index: any) => (
                                                 <option key={index} value={subcategory.id}>
                                                   {locale == "nl" && subcategory.name_nl ? subcategory.name_nl :subcategory.name}
                                                 </option>
                                               ))}
                                           </select>
                                                </td>
                                            </tr>
                                            <tr className="double">
                                                <td className='px-5 pb-2 pt-4'>
                                                    <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="LISTING_PRICE" /> <span className="required">*</span></label>
                                                    <input type="text" onChange={handlePriceChange} value={listPrice} 
                                                      className="form-control input-bg-color-2 border-0 products-name custom-color-2" 
                                                      placeholder={placeholderTranslations[locale]['price']} 
                                                      />
                                                </td>
                                                <td className='px-5 pb-2 pt-4'>
                                                    <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="LISTING_QUANTITY" /> <span className="required">*</span></label>
                                                    <input type="text" value={listQuantity} onChange={handleQuantityChange}
                                                      className="form-control input-bg-color-2 border-0 products-name custom-color-2" 
                                                      placeholder={placeholderTranslations[locale]['quantity']}
                                                      onKeyPress={(e: any) => {
                                                        if (e.key === '0' && e.target.value === '') {
                                                            e.preventDefault();
                                                        }
                                                    }}   
                                                    />
                                                </td>
                                            </tr>
                                            <tr className="double">
                                                <td className='px-5 pb-2 border-0'>
                                                    <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="ON_SALE" /></label><br />
                                                    <select className="form-select input-bg-color-2 border-0 products-name custom-color-2"
                                                        value={saleOffer} onChange={handleSaleChange}>
                                                            {saleArray && saleArray.map((sale: any) => (
                                                            <option key={sale.id} value={sale.id}>{locale == "nl" ? sale.attributes.nl_discount_text : sale.attributes.en_discount_text}</option>))}
                                                    </select>  
                                                </td>
                                                {/* <td className='px-5 pb-2 border-0'>
                                                    <label className="custom-color-2 regularfont products-name pb-2">Location of Part <span className="required">*</span></label>
                                                    <input type="text" value={listLocation} onChange={handleLocationChange} 
                                                      className="form-control input-bg-color-2 border-0 products-name custom-color-2" placeholder="Location of Part" />
                                                </td> */}
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
                                                            value={locationText}
                                                            className={`form-control input-bg-color-2 border-0 products-name custom-color-2 ${incomplete && !locationNo ? 'required-field' : 'border-0'}`} 
                                                            style={{height: "2.3rem"}}
                                                            placeholder={placeholderTranslations[locale]['location']}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="single">
                                                <td colSpan={2} className='px-5 pb-2 border-0'>
                                                    <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="ARTICLE_NUMBER" /> <span className="required">*</span></label>
                                                    <input type="text" onChange={handleArticleChange} 
                                                    value={listArticle}
                                                    className="form-control input-bg-color-2 border-0 products-name custom-color-2" 
                                                    placeholder={placeholderTranslations[locale]['article']}  
                                                    />
                                                </td>
                                            </tr>
                                            <tr className="single">
                                                <td colSpan={2} className='px-5 pb-4 pt-2 border-0'>
                                                    <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="BAR_CODE" /> :</label>
                                                        <div style={{ padding: "5px", background: `#ffcf00`, width: "415px", height: "190px" }}
                                                            className='d-flex align-items-center justify-content-center flex-column'
                                                            ref={componentRef}
                                                            >
                                                            <div className="details d-flex" style={{ width: "100%", fontWeight: "500", fontFamily: "poppinsregular", fontSize: "17px" }}>
                                                                <div className='d-flex justify-content-between' style={{ minWidth: "180px" }}>
                                                                    {listBarcode && <Qrgenerator qrValue={listBarcode} />}
                                                                </div>
                                                                <div className='d-flex flex-column' style={{width: "100%", letterSpacing: "0.6px"}}>
                                                                    <div>
                                                                        <div>UBOPARTS</div>
                                                                        <div>{listName.toUpperCase()}</div>
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
                                                                size: 11cm 5cm;
                                                                margin: 0;
                                                            }
                                                            @media print {
                                                            body {
                                                            width: 11cm;
                                                            height: 5cm;
                                                                }
                                                            }
                                                            `}
                                                            trigger={() => (
                                                                <button
                                                                    type="button"
                                                                    className="edit rounded button-bg-color-1 text-white boldfont mini-text-1 custom-border-2 p-2 my-2"
                                                                    style={{ width: "415.78px" }}
                                                                >
                                                                    Print
                                                                </button>
                                                            )}
                                                            content={() => componentRef.current}
                                                        /> */}
                                                        <button
                                                          type="button"
                                                          className="edit rounded button-bg-color-1 text-white boldfont mini-text-1 custom-border-2 p-2 my-2"
                                                          style={{ width: "415.78px" }}
                                                          onClick={printBarcode}
                                                        >
                                                          <FormattedMessage id="PRINT" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="double">
                                              <td className='px-5 pt-4 pb-2'>
                                                <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="LISTING_FEATURED_IMAGE" /> <span className="required">*</span></label>
                                                <input className="form-control pt-2 pb-1 choosefile" type="file" id="featuredImages" 
                                                  onChange={handleFeaturedImageChange} ref={inputRef} required 
                                                />
                                                  {productImage ? (
                                                    <div className="selected-featured-image" style={{ position: "relative", width: "200px", padding: "10px 0" }}>
                                                      <button style={{ position: 'absolute', top: '10px', right: '15px', border: "none", color: "white", backgroundColor: "transparent", padding: "5px", borderRadius: "50%", cursor: "pointer" }}
                                                        onClick={() => handleDeleteFeaturedImage()}>
                                                        <i className='fa fa-trash'></i>
                                                      </button>
                                                      {typeof productImage === 'string' ? (
                                                        <img src={BASE_URL + productImage} alt="Selected Featured" width={200} height={200} style={{ borderRadius: "20px" }} />
                                                      ) : (
                                                        <img src={URL.createObjectURL(productImage)} alt="Selected Featured" width={200} height={200} style={{ borderRadius: "20px" }} />
                                                      )}
                                                    </div>
                                                  ) : null}
                                              </td>
                                              <td className='px-5 pt-4 pb-2'>
                                                <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="LISTING_IMAGES" /> </label>
                                                <input className="form-control pt-2 pb-1 choosefile" type="file" id="galleryImages"
                                                  onChange={handleGalleryImagesChange} multiple disabled={!productImage}  ref={galleryRef} />
                                                {productGalleryImages && (
                                                  <div className="selected-gallery-images" style={{ padding: "10px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                                    {productGalleryImages.map((image: any, index: any) => (
                                                      <div key={index} style={{ position: 'relative' }}>
                                                        {typeof image?.attributes?.url === 'string' ? (
                                                          <img src={BASE_URL + image?.attributes.url} alt={`Selected ${index + 1}`} height={200} style={{ width: "100%", borderRadius: "20px", maxWidth: "210px" }} />
                                                        ) : (
                                                          <img src={URL.createObjectURL(image)} alt={`Selected ${index + 1}`} height={200} style={{ width: "100%", borderRadius: "20px", maxWidth: "210px" }} />
                                                        )}
                                                        <button style={{ position: 'absolute', top: '5px', right: '10px', border: "none", color: "white", background: "none" }} onClick={() => handleDeleteGalleryImage(image.id, index)}>
                                                          <i className='fa fa-trash mr-3'></i>
                                                        </button>
                                                        {/* Add delete button if needed */}
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </td>
                                            </tr>
                                            <tr className="single">
                                                <td colSpan={2} className='px-5 pb-2 border-0'>
                                                    <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="LISTING_DESCRIPTION" /> <span className="required">*</span></label>
                                                    <textarea value={listDescription} onChange={handleDescriptionChange}
                                                      className={`form-control input-bg-color-2 border-0 products-name rounded 
                                                        ${incomplete && !listDescription ? 'required-field' : 'border-0'}`} rows={4}
                                                        placeholder={placeholderTranslations[locale]['type']} 
                                                        required>
                                                    </textarea>
                                                </td>
                                            </tr>
                                            <tr className="single">
                                                <td colSpan={2} className="border-0 px-5">
                                                  {
                                                    clicked ? 
                                                    <button type="submit" disabled className="place-quote text-white mediumfont products-name rounded border-0 button-bg-color-1 ubo-btn-custom"><FormattedMessage id="SAVING" /></button>
                                                    :
                                                    <button type="submit" onClick={createNewList} className="place-quote text-white mediumfont products-name rounded border-0 button-bg-color-1 ubo-btn-custom"><FormattedMessage id="SAVE" /></button>
                                                  }
                                                </td>
                                            </tr>
                                        </tbody>
                                           }
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
export default EditListing;