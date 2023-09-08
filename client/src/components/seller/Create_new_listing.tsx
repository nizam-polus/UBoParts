import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '~/components/shared/AppImage';
import Link from 'next/link';
import SellerSideBar from './SellerSideBar';
import APIs from '~/services/apiService';
function Create_new_listing() {
    const [error, setError] = useState(null);
    const [makesArray, setMakesArray] = useState<any>([]);
    const [modelArray, setModelArray] = useState<any>([]);
    const [yearArray, setYearArray] = useState<any>([]);
    const [categories, setCategories] = useState<any>([]);
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [licenseplate, setLicenseplate] = useState('');
    const [listName, setListName] = useState('');
    const [listPrice, setListPrice] = useState('');
    const [listQuantity, setListQuantity] = useState('');
    const [listArticle, setListArticle] = useState('');
    const [listBarcode, setListBarcode] = useState('');
    const [listDescription, setListDescription] = useState('');
    const [listLocation, setListLocation] = useState('');

    useEffect(() => {
        APIs.getCategories().then((response: any) => {
            setCategories(categoriesArray(response.data.data));
        })
            .catch((error) => {
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
        setLicenseplate(event.target.value.toUpperCase());
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
        setSelectedCategory(event.target.value);
    };

    const handleListChange = (event: any) => {
        setListName(event.target.value);
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

    const handleArticleChange = (event: any) => {
        setListArticle(event.target.value)
    }

    const handleBarcodeChange = (event: any) => {
        setListBarcode(event.target.value)
    }

    const handleDescriptionChange = (event: any) => {
        setListDescription(event.target.value)
    }

    const createNewList = () => {
        APIs.createNewList({
            "data": {
              "title": listName,
              "cardetail": [2],
              "category": [1],
              "sub_category": [1],
              "price": listPrice,
              "stock_count": listQuantity,
              "product_location_warehouse": listLocation,
              "article_number": listArticle,
              "part_no_barcode_no": listBarcode,
              "product_image": "",
              "product_gallary_image": "",
              "description": listDescription,
              "product_status": "Active",
              "seller": null
            }
          }).then((response: any) => {
        })
            .catch((error) => {
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
                                                        <input type="text" onChange={handleListChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" name="first-name" placeholder="24 Inch Tyre for Mustang" />
                                                    </td>
                                                    <td className='px-5 pt-4 pb-4'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Plate Number <span className="required">*</span></label>
                                                        <input type="text" onChange={handleLicenseplateChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" name="last-name" placeholder="Enter Plate Number to Auto Fill form" />
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
                                                        <select className="form-select input-bg-color-2 border-0 products-name custom-color-2">
                                                            <option>Choose Category</option>
                                                        </select>
                                                    </td>
                                                    <td colSpan={2} className='px-5 pb-4 border-top-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Sub Category</label><br />
                                                        <select className="form-select input-bg-color-2 border-0 products-name custom-color-2">
                                                            <option>Choose Sub Category</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td className='px-5 pb-2 pt-4'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Price (€)</label>
                                                        <input type="text" onChange={handlePriceChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" placeholder="Listing Price (€)" />
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
                                                <tr className="single">
                                                    <td colSpan={2} className='px-5 pb-2 border-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Article No</label>
                                                        <input type="text" onChange={handleArticleChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" placeholder="Article No" />
                                                    </td>
                                                </tr>
                                                <tr className="single">
                                                    <td colSpan={2} className='px-5 pb-4 pt-2 border-0'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Part No/Barcode No</label>
                                                        <input type="text" onChange={handleBarcodeChange} className="form-control input-bg-color-2 border-0 products-name custom-color-2" placeholder="Listing Part No/Barcode No" />
                                                    </td>
                                                </tr>
                                                <tr className="double">
                                                    <td className='px-5 pt-4 pb-2' >
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Featured Image</label>
                                                        <input className="form-control pt-2 pb-1 choosefile" type="file" id="formFile" />
                                                    </td>
                                                    <td className='px-5 pt-4 pb-2'>
                                                        <label className="custom-color-2 regularfont products-name pb-2">Listing Image(s)</label>
                                                        <input className="form-control pt-2 pb-1 choosefile" type="file" id="formFile" />
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