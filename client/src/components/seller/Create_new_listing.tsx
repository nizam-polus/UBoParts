import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '~/components/shared/AppImage';
import Link from 'next/link';
import SellerSideBar from './SellerSideBar';
import APIs from '~/services/apiService';
import Qrgenerator from './Qrgenerator';
import { useRouter } from 'next/router';

function Create_new_listing() {
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

    const router = useRouter()

    useEffect(() => {
        let userDetails: any = localStorage.getItem("userdetails")
        const userDetailsJSON = JSON.parse(userDetails);
        const username = userDetailsJSON.username;
        const userid = userDetailsJSON.id;
        setUname(username)
        setUid(userid)
        //FETCH AND SOTRE PARTS
        APIs.getParts().then((res) => {
            setParts(res.data.data);
            console.log(parts)
          });
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
                       
                        setSelectedMake(response.data.make);
                        getModel(response.data.make);
                        setSelectedModel(response.data.model);
                        getYear(response.data.make, response.data.model);
                        setSelectedYear(response.data.year);
                    }
                    else {
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

    const categoriesArray = (resData: any) => {
        return [...new Set(resData.map((item: any) => item.attributes.category_name))];
    }

    const handleLicenseplateChange = (event: any) => {
        const enteredLicenseplate = event.target.value.toUpperCase();
        setLicenseplate(enteredLicenseplate);
      
        APIs.getCarDetailsUsingLicence(enteredLicenseplate)
          .then((response) => {
            console.log("carDetail", response);
            console.log(response.data.id);
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
      
    const handleListChange = (event: any) => {
        setInputValue(event.target.value);
        setListName(event.target.value)
        setSelectedItem(null)
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

    // const handleArticleChange = (event: any) => {
    //     setListArticle(event.target.value)
    // }

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
            console.log('files[i]', files[i])
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
     console.log(selectedCategoryId,parseInt(selectedSubcategoryId),carDetailId )
        APIs.createNewList({
            "data": {
              "title": listName,
              "cardetail": [carDetailId],
              "category": [selectedCategoryId],
              "sub_category": [parseInt(selectedSubcategoryId)],
              "price": listPrice,
              "stock_count": [listQuantity],
              "product_location_warehouse": listLocation,
              "article_number": listBarcode,
              "part_no_barcode_no": listBarcode,
              "description": listDescription,
              "product_status": "Active",
              "seller": uname,
              "seller_id" : uid,
            }
          }).then((response: any) => {
            const resId = response.data.data.id;
            // console.log(response.data.data.id);
            // Check if productImage is defined and not null
            // console.log('productGalleryImages', productGalleryImages)
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
                      console.log(`Gallery image ${index + 1} uploaded successfully:`, galleryImageUploadResponse);
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
                                                    <th colSpan={2} className="px-5 pb-1 ps-0 custom-color-3  regularfont body-sub-titles border-bottom border-top-0">Create New Listing</th>
                                                </tr>

                                                <tr className="double">
                                                <td className='px-5 pt-4 pb-4'>
                                                    <label className="custom-color-2 regularfont products-name pb-2">List Name <span className="required">*</span></label>
                                                    <input type="text" value={inputValue} onChange={handleListChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" name="first-name" placeholder="24 Inch Tyre for Mustang" required/>
                                                    
                                                    <ul style={{display: "contents"}}>
                                                    {selectedItem ? (
                                                        ""
                                                      ) : (
                                                        <div className="options-container" style={{ backgroundColor: "#ebebeb" , boxShadow:"1px 0px 7px 0px grey"}}>
                                                          {parts
                                                            .filter((part:any) => part.attributes.parts.toLowerCase().includes(inputValue.toLowerCase()) && inputValue.length >= 3)
                                                            .map((part:any) => (
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
                                                        <label className="custom-color-2 regularfont products-name pb-2">Plate Number <span className="required">*</span></label>
                                                        <input type="text" onChange={handleLicenseplateChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" name="last-name" placeholder="Enter Plate Number to Auto Fill form" required/>
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
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Price (€)</label>
                                                        <input type="text" onChange={handlePriceChange} value={listPrice} className="form-control input-bg-color-2 border-0 products-name custom-color-2" placeholder="Listing Price (€)" />
                                                    </td>
                                                    <td className='px-5 pb-2 pt-4'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Quantity</label>
                                                        <input type="text" onChange={handleQuantityChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" placeholder="Listing Quantity" />
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
                                                        <input type="text" onChange={handleLocationChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" placeholder="Location of Part" />
                                                    </td>
                                                </tr>
                                                {/* <tr className="single">
                                                    <td colSpan={2} className='px-5 pb-2 border-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Article No</label>
                                                        <input type="text" onChange={handleArticleChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" placeholder="Article No" />
                                                    </td>
                                                </tr> */}
                                                <tr className="single">
                                                    <td colSpan={2} className='px-5 pb-4 pt-2 border-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Article No</label>
                                                        <input type="text" onChange={handleBarcodeChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" placeholder="Listing Part No/Barcode No" />
                                                        {listBarcode && <Qrgenerator qrValue={listBarcode}/>}
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td className='px-5 pt-4 pb-2' >
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Featured Image <span className="required">*</span></label>
                                                        <input className="form-control pt-2 pb-1 choosefile" type="file" id="featuredImages"  onChange={handleFeaturedImageChange} required/>
                                                        
                                                        {productImage && (
                                                    <div className="selected-featured-image" style={{padding: "10px 0"}}>
                                                    <img src={URL.createObjectURL(productImage)} alt="Selected Featured" width={200} height={200} style={{borderRadius: "20px"}}/>
                                                    {/* <button  onClick={handleDeleteFeaturedImage}>
                                                      <FaTrash /> Delete
                                                    </button> */}
                                                  </div>
                                                    )}

                                                    </td>
                                                    <td className='px-5 pt-4 pb-2'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Image(s) <span className="required">*</span></label>
                                                        <input className="form-control pt-2 pb-1 choosefile" type="file" id="galleryImages"  onChange={handleGalleryImagesChange} multiple required/>
                                                        {productGalleryImages.length > 0 && (
                                                   <div className="selected-gallery-images" style={{padding: "10px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
                                                       {productGalleryImages.map((image : any, index: any) => (
                                                          <div key={index} style={{ position: 'relative' }}>
                                                          <img src={URL.createObjectURL(image)} alt={`Selected ${index + 1}`} height={200} style={{ width: "100%", borderRadius: "20px", maxWidth: "210px" }} />
                                                          <button  style={{ position: 'absolute', top: '5px', right: '10px', border: "none", background: "none", color: "white" }} onClick={() => handleDeleteGalleryImage(index)}>
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
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Description</label>
                                                        <textarea onChange={handleDescriptionChange} className="form-control input-bg-color-2 border-0 products-name rounded" rows={4}></textarea>
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2} className="border-0 px-5">
                                                        <button type="submit" onClick={createNewList} className="place-quote text-white mediumfont products-name rounded border-0 button-bg-color-1">Create Listing</button>
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