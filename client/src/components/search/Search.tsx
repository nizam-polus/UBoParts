// react
import React, { PropsWithChildren } from 'react';
interface Props extends PropsWithChildren<{}>{ }

function Search(props: Props) {
    const { children } = props;
    // const {selectedMake, selectedModel, selectedYear, selectedCategory, makesArray, modelArray, yearArray} = children;
    
    const handleMakeChange = (event: any) => {
        // getModel(event.target.value);
        // setSelectedMake(event.target.value);
    };

    const handleLicenseplateChange = (event: any) => {
        // setSearched(false);
        // setLicenseplate(event.target.value);
    };

    const handleModelChange = (event: any) => {
        // setSearched(false);
        // setSelectedModel(event.target.value);
        // setSelectedYear('');
        // setSelectedCategory('');
        // getYear(selectedModel, event.target.value);
    };

    const handleYearChange = (event: any) => {
        // setSelectedYear(event.target.value);
        // setSelectedCategory('');
    };

    const handleCategoryChange = (event: any) => {
        // setSelectedCategory(event.target.value);
    };

    const toggleAdvancedSearch = () => {
        // setToggleSearch(!toggleSearch);
    }


    return (
        <div className="row g-4 flex-column flex-lg-row mt-2">
        {/* <div className="col">
            <div className="form-group">
                <select className="form-select semifont placeholderfontsize" name="make" id="makeOption"
                    value={selectedMake} onChange={handleMakeChange}>
                    <option value="" disabled={true}>Select Make</option>
                    {makesArray.map((make: any, index: any) => (
                        <option key={index} value={make.make}>{make.make}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className="col">
            <div className="form-group">
                <select disabled={!selectedMake} className="form-select semifont placeholderfontsize" name="model" id="modelOption"
                    value={selectedModel} onChange={handleModelChange}>
                    <option value="" disabled={true}>Select Model</option>
                    {modelArray.map((model: any, index: any) => (
                        <option key={index} value={model.model}>{model.model}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className="col">
            <div className="form-group">
                <select disabled={!selectedModel || (yearArray && yearArray.length && !yearArray[0].year)} className="form-select semifont placeholderfontsize" name="year" id="yearOption"
                    value={selectedYear} onChange={handleYearChange}>
                    <option value="" disabled={true}>Select Year</option>
                    {yearArray.map((year: any, index: any) => (
                        <option key={index} value={year.year}>{year.year}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className="col">
            <div className="form-group">
                <select disabled={!selectedYear} className="form-select semifont placeholderfontsize" name="category" id="categoryOption"
                    value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="" disabled={true}>Select Category</option>
                    {categories.map((category: any, index: any) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>
            </div>
        </div> */}
    </div>
    );
}

export default Search;
