import React, { useCallback, useEffect, useState, useRef } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '~/components/shared/AppImage';
import Link from 'next/link';
import SellerSideBar from './SellerSideBar';
import APIs from '~/services/apiService';
import { useRouter } from 'next/router';
import { BASE_URL } from 'configuration';
import { toast } from 'react-toastify';


function EditListing() {
    const [error, setError] = useState(null);
    const [makesArray, setMakesArray] = useState<any>([]);
    const [modelArray, setModelArray] = useState<any>([]);
    const [yearArray, setYearArray] = useState<any>([]);
    const [categories, setCategories] = useState<any>([]);
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [licenseplate, setLicenseplate] = useState('');
    const [listName, setListName] = useState('');
    const [listPrice, setListPrice] = useState('');
    const [listQuantity, setListQuantity] = useState('');
    const [listArticle, setListArticle] = useState('');
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
    const [incomplete, setIncomplete] = useState<any>(false);
    const [partsInput, setPartsInput] = useState()

    const router = useRouter()
    const id = router.query.id;
    const [productData, setProductData] = useState<any>({})
    const [productGallery, setProductGallery] = useState([])
    const [quantity, setQuantity] = useState(1);
 
    useEffect(() => {
        APIs.getProduct(id).then(response => {
            let product = response.data.data;
            if(response.data.data.attributes?.product_gallary_image?.data.length >0 && response.data.data.attributes?.product_image.data == null){
              let productImage = response.data.data.attributes?.product_gallary_image?.data[0]?.attributes?.url;
              setProductImage(productImage);
            }else{
              let productImage =response.data.data.attributes?.product_image?.data.attributes.url
              setProductImage(productImage);
            }
            let productGallery = response.data.data.attributes?.product_gallary_image?.data;
            let make = response.data.data.attributes?.cardetail?.data?.attributes?.make  
            let model = response.data.data.attributes?.cardetail?.data?.attributes?.model
            let year = response.data.data.attributes?.cardetail?.data?.attributes?.year  
            let licenseplate = response.data.data?.attributes?.cardetail?.data?.attributes?.licenseplate
            setProductData(product);
            setProductGalleryImages(productGallery);
            setListName(response.data.data.attributes.title)
            console.log(response.data.data.attributes.title)
            setListPrice(response.data.data.attributes.price)
            setListQuantity(response.data.data.attributes.stock_count)
            setListLocation(response.data.data.attributes.product_location_warehouse)
            setListBarcode(response.data.data.attributes.article_number)
            setListDescription(response.data.data.attributes.description)
            setSelectedCategory(response.data.data.attributes.category.data.attributes.category_name)
            setSelectedCategoryId(response.data.data.attributes.category.data.id)
            setSelectedSubcategoryId(response.data.data.attributes.sub_category.data.id)
            setSelectedSubcategory(response.data.data.attributes.sub_category.data.attributes.name)
            setCarDetailId(response.data.data?.attributes?.cardetail?.data.id)
            
            APIs.getSubcategories(response.data.data.attributes.category.data.id)
                .then((response) => {
                    // Extract subcategory data
                    const subcategoryData = response.data.rows;
                    setSubcategories(subcategoryData);
                    const initialSubcategory: any = subcategories.find(
                        (subcategory: any) => subcategory.category_id === selectedSubcategoryId
                    );
                    if (initialSubcategory) {
                        setSelectedSubcategoryId(initialSubcategory.id);
                    }
                    setSelectedMake(make)
                    setSelectedModel(model)
                    setSelectedYear(year)
                    setLicenseplate(licenseplate)
                })
        }).catch(err => console.log(err))
    }, []);

    useEffect(() => {
        let userDetails: any = localStorage.getItem("userdetails")
        const userDetailsJSON = JSON.parse(userDetails);
        const username = userDetailsJSON.username;
        const userid = userDetailsJSON.id;
        setUname(username)
        setUid(userid)
       
       // Fetch categories data
    APIs.getCategories()
    .then((response) => {
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
        if (licenseplate && licenseplate.length > 5) {
            const getData = setTimeout(() => {
                APIs.getCarDetailsUsingLicence(licenseplate).then((response: any) => {
                    if (response.data.licenseplate) {
                        // get make
                        let makesobjarray = makesArray;
                        let makesarray = makesobjarray.map((item: any) => item.make) 
                        !makesarray.includes(response.data.make) && makesobjarray.push({make: response.data.make})
                        setMakesArray(makesobjarray);
                        setSelectedMake(response.data.make);
                        // get model
                        getModel(response.data.make);
                        let modelsobjarray = modelArray;
                        let modelsarray = modelsobjarray.map((item: any) => item.model);
                        !modelsarray.includes(response.data.model) && modelsobjarray.push({model: response.data.model});
                        setModelArray(modelsobjarray)
                        setSelectedModel(response.data.model);
                        //get year
                        getYear(response.data.make, response.data.model);
                        let yearsobjarray = yearArray;
                        let yearsarray = yearsobjarray.map((item: any) => item.year);
                        !yearsarray.includes(response.data.year) && yearsobjarray.push({year: response.data.year});
                        setYearArray(yearsobjarray);
                        setSelectedYear(response.data.year);

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

    const handleMakeChange = (event: any) => {
        getModel(event.target.value);
        setSelectedMake(event.target.value);
    };

    const getModel = (make: string) => {
        const setData = { 'param_make': make }
        APIs.getCarModel(setData).then((response: any) => {
            setModelArray(response.data.rows);
        })
            .catch((error) => {
                setError(error);
            });
    }

    const getYear = (make: string, model: string) => {
        const setData = { 'param_make': make, 'param_model': model }
        APIs.getCarYear(setData).then((response: any) => {
            setYearArray(response.data.rows);
        })
            .catch((error) => {
                setError(error);
            });
    }

    const handleModelChange = (event: any) => {
        setSelectedModel(event.target.value);
        setSelectedYear('');
        setSelectedCategory('');
        getYear(selectedModel, event.target.value);
    };

    const handleYearChange = (event: any) => {
        setSelectedYear(event.target.value);
        setSelectedCategory('');
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
          console.log(inputValue)
                  
          APIs.getParts(inputValue).then((res) => {
            setParts(res.data.data);
            
            // setSelectedItem(null)
          });
        }, 500)
    
        return () => clearTimeout(delayDebounceFn)
      }, [inputValue])
      
    const handleListChange = (event: any) => {
         setInputValue(event.target.value)
         setListName(event?.target.value)
    };

    const handlePartSelect = (partName: any) => {
     // Update the listName state with the selected part
     setSelectedItem(partName);
     setListName(partName);
     setInputValue(partName);
      };

    const handlePriceChange = (event: any) => {
        setListPrice(event.target.value)
    }
    
    const handleQuantityChange = (event: any) => {
        setListQuantity(event.target.value)
    }
    const handleLocationChange = (event: any) => {
        setListLocation(event.target.value)
    }
    const handleBarcodeChange = (event: any) => {
        setListBarcode(event.target.value)
    }

    const handleDescriptionChange = (event: any) => {
        setListDescription(event.target.value)
    }

    const handleFeaturedImageChange = (event: any) => {
        const file = event.target.files[0];
        setProductImage(file);
    };

    const handleGalleryImagesChange = (event: any) => {
        const files = event.target.files;
        const selectedImages = [];
        for (let i = 0; i < files?.length; i++) {
          selectedImages.push(files[i]);
        }
        setProductGalleryImages(selectedImages);
      };

    const handleDeleteFeaturedImage = () => {
        // Remove the featured image by setting it to null
        setProductImage(null);
    };
    
    const handleDeleteGalleryImage = (index: any) => {
        // Create a copy of the gallery images array
        const updatedGalleryImages = [...productGalleryImages];
        // Remove the image at the specified index
        updatedGalleryImages.splice(index, 1);
        // Update the state with the modified gallery images
        setProductGalleryImages(updatedGalleryImages);
    };

    const createNewList = () => {

      let incomplete = !(!!listName && !!carDetailId && selectedCategoryId && !!selectedSubcategoryId && !!listPrice && !!listQuantity && !!listLocation && !!listBarcode && !!listDescription && !!uname && !!uid)
    setIncomplete(incomplete);
      if(!incomplete){
        APIs.updateList(id,{
          "data": {
            "title": listName,
            "cardetail": [carDetailId],
            "category": [selectedCategoryId],
            "sub_category": [parseInt(selectedSubcategoryId)],
            "price": listPrice,
            "stock_count": [listQuantity],
            "product_location_warehouse": listLocation,
            // "part_no_barcode_no": listBarcode,
            "description": listDescription,
            "product_status": "Active",
            "seller": uname,
            "seller_id" : uid,
          }
        }).then((response: any) => {
          const resId = response.data.data.id;
          if (productImage && productImage instanceof File) {
            // Make the API call to upload the featured image
            APIs.uploadImage({
              ref: "api::product.product",
              refId: resId,
              field: "product_image",
              files: productImage,
            })
            for (let i = 0; i < productGalleryImages.length; i++) {
              const galleryImage = productGalleryImages[i];
              // Use a closure to capture the current value of 'i'
              (function (index) {
                APIs.uploadImage({
                  ref: "api::product.product",
                  refId: resId,
                  field: "product_gallary_image",
                  files: galleryImage,
                })
                  .then((galleryImageUploadResponse) => {
                  })
                  .catch((galleryImageUploadError) => {
                    console.error(`Gallery image ${index + 1} upload error:`, galleryImageUploadError);
                  });
              })(i);
            }

          } else {
            // Handle the case where productImage is not defined
            console.error("No product image selected.");
          }
        }).then(() => router.push('/seller/listings'))
        .catch((error) => {
          console.log(error);
          setError(error);
        });
      }else{
        toast.error("Fill all fields for Edt list")
      }
        
        }
    return (

        <>
            <div className="main-body pb-2 mb-5">
                <div className="container">
                    <section className="quote-wrapper mt-5">
                        <div className="row mt-3 g-4">
                            <SellerSideBar />
                            <div className="col-12 col-md-9">
                                <div className="coulmn-bg-color-1 rounded">
                                    <div className="table-responsive pt-3 pb-3 overflow-hidden">
                                        <table className="table profile-table-1 coulmn-bg-color-1 rounded">
                                            <tbody className="double">
                                                <tr>
                                                    <th colSpan={2} className="px-5 pb-1 ps-0 custom-color-3  regularfont body-sub-titles border-bottom border-top-0">Edit List</th>
                                                </tr>

                                                <tr className="double">
                                                <td className='px-5 pt-4 pb-4'>
                                                    <label className="custom-color-2 regularfont products-name pb-2">List Name <span className="required">*</span></label>
                                                    <input type="text" value={listName} onChange={handleListChange} className={`form-control input-bg-color-2 border-0 products-name custom-color-2 ${incomplete && !listName ? 'required-field' : 'border-0' }`} name="first-name" placeholder="24 Inch Tyre for Mustang" required/>
                                                    
                                                    <ul style={{display: "contents"}}>
                                                            {parts.length > 0 && inputValue.length >= 3 && !selectedItem && (
                                                                <ul style={{ display: "contents" }}>
                                                                    <div className="options-container  position-absolute" style={{ backgroundColor: "#ebebeb", boxShadow: "1px 0px 7px 0px grey", zIndex: 3, maxHeight: "200px", overflowY: "scroll", overflowX: "hidden", width: "22rem" }}>
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
                                                        <label className="custom-color-2 regularfont products-name pb-2">Plate Number <span className="required">*</span></label>
                                                        <input type="text" value={licenseplate} onChange={handleLicenseplateChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" name="last-name" placeholder="Enter Plate Number to Auto Fill form" required/>
                                                        {showInvaidLicense &&
                                                    <div className="row mt-2 ml-2" >
                                                        <span className="advanced_search placeholderfontsize regularfont">No Record Found Against this Plate Number!</span>
                                                    </div>
                                                }
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td className='px-5 pt-4 pb-2'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Make</label><br />
                                                        <select className="form-select input-bg-color-2 border-0 products-name custom-color-2" name="make" id="makeOption"
                                                            value={selectedMake} onChange={handleMakeChange}>
                                                            <option value="" disabled={true}>Select Make</option>
                                                            {makesArray && makesArray.map((make: any, index: any) => (
                                                                <option key={index} value={make.make}>{make.make}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className='px-5 pt-4 pb-2'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Model</label><br />
                                                        <select disabled={!selectedMake} className="form-select input-bg-color-2 border-0 products-name custom-color-2" name="model" id="modelOption"
                                                            value={selectedModel} onChange={handleModelChange}>
                                                            <option value="" disabled={true}>Select Model</option>
                                                            {modelArray && modelArray.map((model: any, index: any) => (
                                                                <option key={index} value={model.model}>{model.model}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td className='px-5 pb-2 border-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Year</label><br />
                                                        <select disabled={!selectedModel || (yearArray && yearArray.length && !yearArray[0].year)} className="form-select input-bg-color-2 border-0 products-name custom-color-2" name="year" id="yearOption"
                                                            value={selectedYear} onChange={handleYearChange}>
                                                            <option value="" disabled={true}>Select Year</option>
                                                            {yearArray && yearArray.map((year: any, index: any) => (
                                                                <option key={index} value={year.year}>{year.year}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td className='px-5 pb-2 border-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Category</label><br />
                                                        <select className="form-select input-bg-color-2 border-0 products-name custom-color-2"  value={selectedCategory} onChange={handleCategoryChange}>
                                                            <option>Choose Category</option>
                                                            {categoriesDetails && categoriesDetails.map((category: any, index: any) => (
                                                                <option key={index} value={category}>{category}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td colSpan={2} className='px-5 pb-4 border-top-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Sub Category</label><br />
                                                        <select
                                                   className="form-select input-bg-color-2 border-0 products-name custom-color-2"
                                                   value={selectedSubcategoryId} // Use selectedSubcategoryId to store the ID
                                                   onChange={(e) => setSelectedSubcategoryId(e.target.value)} // Update the selected subcategory ID
                                                   disabled={!subcategories || subcategories.length === 0}
                                                 >
                                                 <option >Choose Sub Category</option>
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
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Price (€)</label>
                                                        <input type="text" onChange={handlePriceChange} value={listPrice} className="form-control input-bg-color-2 border-0 products-name custom-color-2" placeholder="Listing Price (€)" />
                                                    </td>
                                                    <td className='px-5 pb-2 pt-4'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Quantity</label>
                                                        <input type="text" value={listQuantity} onChange={handleQuantityChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" placeholder="Listing Quantity" />
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td className='px-5 pb-2 border-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">On Sale</label><br />
                                                        <select className="form-select input-bg-color-2 border-0 products-name custom-color-2">
                                                            <option>Select</option>
                                                        </select>
                                                    </td>
                                                    <td className='px-5 pb-2 border-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Location of Part</label>
                                                        <input type="text" value={listLocation} onChange={handleLocationChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" placeholder="Location of Part" />
                                                    </td>
                                                </tr>
                                                {/* <tr className="single">
                                                    <td colSpan={2} className='px-5 pb-2 border-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Article No</label>
                                                        <input type="text" onChange={handleArticleChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" placeholder="Article No" />
                                                    </td>
                                                </tr> */}
                                                {/* <tr className="single">
                                                    <td colSpan={2} className='px-5 pb-4 pt-2 border-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Article No</label>
                                                        <input type="text" value={listBarcode} onChange={handleBarcodeChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" placeholder="Listing Part No/Barcode No" />
                                                        {listBarcode && <Qrgenerator qrValue={listBarcode}/>}
                                                    </td>
                                                </tr> */}
                                               <tr className="double">
                                                <td className='px-5 pt-4 pb-2'>
                              <label className="custom-color-2 regularfont products-name pb-2">Listing Featured Image <span className="required">*</span></label>
                              <input className="form-control pt-2 pb-1 choosefile" type="file" id="featuredImages" onChange={handleFeaturedImageChange} required />

                              {productImage ? (
                                <div className="selected-featured-image" style={{ padding: "10px 0" }}>
                                  <button style={{ position: 'absolute', top: '10px', right: '15px', border: "none", color: "white", backgroundColor: "transparent", padding: "5px", borderRadius: "50%", cursor: "pointer" }} onClick={() => handleDeleteFeaturedImage()}>
                                                                    <i className='fa fa-trash'></i>
                                  </button>
                                  {typeof productImage === 'string' ? (
                                    <img src={BASE_URL + productImage} alt="Selected Featured" width={200} height={200} style={{ borderRadius: "20px" }} />
                                  ) : (
                                    <img src={URL.createObjectURL(productImage)} alt="Selected Featured" width={200} height={200} style={{ borderRadius: "20px" }} />
                                  )}
                                  {/* Add delete button if needed */}
                                </div>
                              ) : null}
                            </td>
                            <td className='px-5 pt-4 pb-2'>
                              <label className="custom-color-2 regularfont products-name pb-2">Listing Image(s) <span className="required">*</span></label>
                              <input className="form-control pt-2 pb-1 choosefile" type="file" id="galleryImages" onChange={handleGalleryImagesChange} multiple required />

                              {productGalleryImages.length > 0 && (
                                <div className="selected-gallery-images" style={{ padding: "10px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                  {productGalleryImages.map((image: any, index: any) => (
                                    <div key={index} style={{ position: 'relative' }}>
                                      {typeof image?.attributes?.url === 'string' ? (
                                        <img src={BASE_URL + image?.attributes.url} alt={`Selected ${index + 1}`} height={200} style={{ width: "100%", borderRadius: "20px", maxWidth: "210px" }} />
                                      ) : (
                                        <img src={URL.createObjectURL(image)} alt={`Selected ${index + 1}`} height={200} style={{ width: "100%", borderRadius: "20px", maxWidth: "210px" }} />
                                      )}
                                      <button  style={{ position: 'absolute', top: '5px', right: '10px', border: "none", color: "white", background: "none" }} onClick={() => handleDeleteGalleryImage(index)}>
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
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Description</label>
                                                        <textarea value={listDescription} onChange={handleDescriptionChange} className="form-control input-bg-color-2 border-0 products-name rounded" rows={4}></textarea>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2} className="border-0 px-5">
                                                        <button type="submit" onClick={createNewList} className="place-quote text-white mediumfont products-name rounded border-0 button-bg-color-1">Edit Listing</button>
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
export default EditListing;