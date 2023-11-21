import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '~/components/shared/AppImage';
import { UserContext } from '../account_/UserContext';
import APIs from '~/services/apiService';
import { BASE_URL } from 'configuration';
import Link from 'next/dist/client/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

function Profile() {

    let locale: any;
    
    if(typeof window !== 'undefined'){
        locale = localStorage.getItem("locale")
    }

    const placeholderTranslations : any = {
        nl: {
            email: 'E-mail',
            first_name: 'Voornaam',
            last_name: 'Achternaam',
            username: 'Gebruikersnaam',
            phone_number: 'Telefoonnummer',
            streetaddress_housenumber: 'Straatnaam Huisnummer',
            streetaddress_apartment: 'Appartement',
            city: 'Stad',
            state: 'Provincie',
            country: 'Land',
            postcode: 'Postcode',
            company_name: 'Bedrijfsnaam',
            Account_type: 'Accounttype',
            Account_title: 'Accounttitel',
            Bank_name: 'Banknaam',
            iban_number: 'IBAN-nummer',
            password: 'Wachtwoord',
            kvk_number: 'KvK-nummer',
            company_btw: 'Bedrijfs-BTW',
        },
        en: {
            email: 'Email',
            first_name: 'First Name',
            last_name: 'Last Name',
            username: 'Username',
            phone_number: 'Phone Number',
            streetaddress_housenumber: 'Street Address House Number',
            streetaddress_apartment: 'Apartment',
            city: 'City',
            state: 'State',
            country: 'Country',
            postcode: 'Postcode',
            company_name: 'Company Name',
            Account_type: 'Account Type',
            Account_title: 'Account Title',
            Bank_name: 'Bank Name',
            iban_number: 'IBAN Number',
            password: 'Password',
            kvk_number: 'KvK Number',
            company_btw: 'Company VAT',
        }
    };

    let userdetails: any;
    if (typeof window !== 'undefined') {
        userdetails = localStorage.getItem('userdetails');
        userdetails = JSON.parse(userdetails);
    }

    const {user, saveUser} = UserContext();
    const router = useRouter();

    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address_1, setAddress_1] = useState<string>('');
    const [address_2, setAddress_2] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [state, setState] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [postcode, setPostcode] = useState<string>('');
    const [newpwd, setNewpwd] = useState<string>('');
    const [confrmpwd, setConfrmpwd] = useState('');
    const [incomplete, setIncomplete] = useState<any>(false);
    const [incompletePwd, setIncompletePwd] = useState<any>(false);
    const [profilePic, setProfilePic] = useState<any>(null);
    const [profilePicURL, setProfilePicURL] = useState<string>('');
    const [countries, setCountries] = useState<any>([]);
    const [pwdmismatch, setPwdMisMatch] = useState<boolean>(false);
    const [newPwdVisible, setNewPwdVisible] = useState(false);
    const [confrmpwdVisible, setConfrmpwdVisible] = useState(false);

    useEffect(() => {
        let userId = !user.id ? userdetails?.id : user.id;
        if (!userId) {
            router.push('/homepage')
        } else {
            getSpecificUser(userId);
        }
    }, []);

    useEffect(() => {
        APIs.getCountries().then(response => {
            setCountries(response.data.data);
        }).catch(error => {
            console.error('Error fetching data:', error);
            toast.error("Error fetching data")
        });
      }, []); 

    const getSpecificUser = (userId: any) => {
        APIs.getSpecificUser(userId).then((response: any) => {
            let user = response.data;
            saveUser(user)
            setFirstname(user.first_name || '');
            setLastname(user.last_name || '');
            setEmail(user.email || '');
            setPhone(user.phone_number || '');
            setAddress_1(user.streetaddress_housenumber || '');
            setAddress_2(user.streetaddress_apartment || '');
            setCity(user.city || '');
            setState(user.state || '');
            setCountry(user.country || '');
            setPostcode(user.postcode || '');
            setProfilePicURL(user.profile_image?.url || '');
        })
    }

    const handleProfileSubmit = (event: any) => {
        event.preventDefault();
        let incomplete = !(!!firstname && !!lastname && !!email && !!phone && !!address_1 && !!city && !!state && !!country && !!postcode)
        setIncomplete(incomplete);
        if (!incomplete) {
            let userData = {
                first_name: firstname,
                last_name: lastname,
                email: email,
                phone_number: phone,
                streetaddress_housenumber: address_1,
                streetaddress_apartment: address_2,
                city: city,
                state: state,
                country: country,
                postcode: postcode,
                shippingaddress_country: country,
                shippingaddress_streataddress_housenumber: address_1,
                shippingaddress_streataddress_apartment: address_2,
                shippingaddress_city: city,
                shippingaddress_state: state,
                shippingaddress_postcode: postcode,
                shippingaddress_phonenumber: phone
            }
            APIs.updateSpecificUser(user.id, userData).then(response => {
                let user = response.data;
                localStorage.setItem('userdetails', JSON.stringify(user));
                saveUser(user);
                toast.success(() =>(<FormattedMessage id="PROFILE_SUCCESS" />))
            }).catch(() => toast.error(<FormattedMessage id="ERROR_PROFILE" />))
        }
    };

    const handlePicUpload = (event: any) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfilePic(file);
            let picData = {
              ref: "plugin::users-permissions.user",
              refId: user.id,
              field: "profile_image",
              files: file, 
            };
            APIs.uploadImage(picData)
              .then((response) => {
                getSpecificUser(user?.id);
              })
              .catch((err) => console.log(err));
          } else {
            toast.warn(<FormattedMessage id="SELECT_VALIED_IMAGE" />);
          }
    };

    const handlePwdChange = (event: any) => {
        event.preventDefault();
        let incompletePswrd = !(!!newpwd && !!confrmpwd);
        setIncompletePwd(incompletePswrd);
        if (newpwd !== confrmpwd) {
            setPwdMisMatch(true);
        } else {
            setPwdMisMatch(false);
            !incompletePswrd && APIs.updateSpecificUser(user.id, {password: confrmpwd}).then(response => {
                let user = response.data;
                user && toast.success(()=>(<FormattedMessage id="PASSWORD_SUCCESS" />), {autoClose: 5000});
                setNewpwd('');
                setConfrmpwd('');
                setTimeout(() => {
                    localStorage.removeItem('usertoken');
                    router.push('/homepage');
                    localStorage.removeItem('userdetails');
                    saveUser({});
                }, 500);
            })
        }
    }

    return (
        <> 
            <div className="main-body pb-2 mb-5">
                <div className="container">
                    <section className="profile-wrapper">
                        <div className="row mt-5">
                            <div className="col">
                                <p className="semifont bg-image-text custom-color-8 text-center"><FormattedMessage id="PROFILE"/></p>
                            </div>
                        </div>
                        <div className="row mt-3 ">
                            <div className="col-12 col-md-12 col-xl-3">
                                <div className="profile-image-wrapper coulmn-bg-color-1 rounded-2 p-5 pb-2 text-center">
                                    <AppImage src={BASE_URL + (profilePicURL || '/images/img/dummy-profile.png')} className="profile-pic" width={"70px"} height={"70px"} style={{borderRadius: "100%"}}/>
                                    <div>
                                        <label  htmlFor="formId" className='position-relative position-overlap-edit-icon'>
                                            <input type="file" id="formId" hidden onChange={handlePicUpload}/>
                                            <AppImage className="icon-size1" src={'images/img/Vector.png'}/>
                                        </label>
                                    </div>
                                    <p className="mt-0 mb-1 custom-color-1 boldfont products-name">{(user.first_name || '') + ' ' + (user.last_name || '')}</p>
                                    <p className="mt-1 mb-2 custom-color-1 regularfont products-name">{user.username}</p>
                                </div>
                                {user.isApproved === 'Active' && user.user_type !== 'seller' && <div className='text-center mt-3'>
                                    <Link href={'/seller-registration'}><a style={{textDecoration: 'underline', color: 'red'}}>Want to become a Seller?</a></Link>
                                </div>}
                            </div>
                            <div className="col-12 col-md-12 col-xl-9 mt-4 mt-xl-0 mt-md-4">
                                <form action="">
                                    <div className="table-responsive">
                                        <table className="table profile-table-1 coulmn-bg-color-1 rounded-2">
                                           {locale && 
                                             <tbody>
                                             <tr>
                                                 <th colSpan={2} className="px-5 pt-3 pb-3 custom-color-3 regularfont subtitles border-top-0 border-bottom"><FormattedMessage id="PERSONAL_DETAILS"/></th>
                                             </tr>
                                         
                                             <tr className="double">
                                                 <td className='pl-5 pr-xl-3 pr-md-3 pr-5 pt-3 pb-2'>
                                                     <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="FIRST_NAME"/><span className="required">*</span></label>
                                                     <input type="text" value={firstname}
                                                         className={`form-control input-bg-color-2 products-name ${incomplete && !firstname ? 'required-field' : 'border-0' }`}
                                                         name="first-name" placeholder={placeholderTranslations[locale]['first_name']}
                                                         onChange={(e) => setFirstname(e.target.value)}
                                                     />
                                                 </td>
                                                 <td className='pr-5 pl-xl-3 pl-md-3 pl-5 pt-3 pb-2'>
                                                     <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="LAST_NAME"/> <span className="required">*</span></label>
                                                     <input type="text" value={lastname}
                                                         className={`form-control input-bg-color-2 products-name ${incomplete && !lastname ? 'required-field' : 'border-0' }`}
                                                         name="last-name" placeholder={placeholderTranslations[locale]['last_name']}
                                                         onChange={(e) => setLastname(e.target.value)}
                                                     />
                                                 </td>
                                             </tr>
                                             <tr className="double">
                                                 <td className="pl-5 pr-xl-3 pr-md-3 pr-5 pb-0 pb-xl-5 pb-md-5 border-0">
                                                     <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="EMAIL_ADDRESS"/> <span className="required">*</span></label>
                                                     <input type="text" value={email} disabled
                                                         className={`form-control input-bg-color-2 products-name ${incomplete && !email ? ' required-field' : 'border-0' }`} 
                                                         name="email-address" placeholder={placeholderTranslations[locale]['email']}
                                                     />
                                                 </td>
                                                 <td className="pr-5 pl-xl-3 pl-md-3 pl-5 pb-5 pb-xl-5 pb-md-5 border-0">
                                                     <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="PHONE"/> <span className="required">*</span></label>
                                                     <input
                                                         type="text"
                                                         value={phone}
                                                         className={`form-control input-bg-color-2 products-name ${incomplete && !phone ? 'required-field' : 'border-0'}`}
                                                         name="phone"
                                                         placeholder="(XXX) XXX-XXXX"
                                                         onChange={(e) => {
                                                             // Use a regular expression to allow only numeric characters
                                                             const numericValue = e.target.value.replace(/\D/g, '');
                                                             setPhone(numericValue);
                                                         }}
                                                     />
                                                 </td>
                                             </tr>
                                         </tbody>
                                           }
                                        </table>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table profile-table-1 coulmn-bg-color-1 rounded-2 mt-2">
                                           {locale && 
                                                 <tbody>

                                                 <tr>
                                                     <th colSpan={2} className="px-5 pt-3 pb-3 custom-color-3 regularfont subtitles border-top-0 border-bottom ">
                                                         <div className="float-left pt-2"><FormattedMessage id="ADDRESS"/></div>
                                                         {/* <div className="float-right">
                                                             <button type="button" 
                                                                 className="custom-color-7 boldfont mini-text-3 rounded border-0 button-bg-color-1 pb-2 pt-2 px-5"
                                                             >Add New</button>
                                                         </div> */}
                                                     </th>
                                                 </tr>
                                                 <tr className="single">
                                                     <td colSpan={2}>
                                                         <div className="mb-3 px-xl-3 pt-2">
                                                             <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="STREET_ADDRESS"/> <span className="required">*</span></label>
                                                             <input type="text" value={address_1}
                                                                 className={`form-control input-bg-color-2 products-name ${incomplete && !address_1 ? ' required-field' : 'border-0' }`} 
                                                                 name="street-name" placeholder={placeholderTranslations[locale]['streetaddress_housenumber']}
                                                                 onChange={(e) => setAddress_1(e.target.value)}
                                                             />
                                                         </div>
                                                         <div className='px-xl-3'>
                                                             <input type="text" value={address_2}
                                                                 className="form-control input-bg-color-2 border-0 products-name" 
                                                                 name="apertment" placeholder={placeholderTranslations[locale]['streetaddress_apartment']}
                                                                 onChange={(e) => setAddress_2(e.target.value)}
                                                             />
                                                         </div>
                                                     </td>
                                                 </tr>
                                                 <tr className="double">
                                                     <td className='pl-5 pr-xl-3 pr-md-3 pr-5'>
                                                         <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="CITY"/> <span className="required">*</span></label>
                                                         <input type="text" value={city}
                                                             className={`form-control input-bg-color-2 products-name ${incomplete && !city ? ' required-field' : 'border-0' }`}
                                                             name="city" placeholder={placeholderTranslations[locale]['city']}
                                                             onChange={(e) => setCity(e.target.value)}
                                                         />
                                                     </td>
                                                     <td className='pr-5 pl-xl-3 pl-md-3 pl-5'>
                                                         <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="STATE"/> <span className="required">*</span></label>
                                                         <input type="text" value={state}
                                                             className={`form-control input-bg-color-2 products-name ${incomplete && !state ? ' required-field' : 'border-0' }`} 
                                                             name="state" placeholder={placeholderTranslations[locale]['state']}
                                                             onChange={(e) => setState(e.target.value)}
                                                         />
                                                     </td>
                                                 </tr>
                                                 <tr className="double">
                                                     <td className="pb-0 pb-xl-5 pb-md-5 pl-5 pr-xl-3 pr-md-3 pr-5">
                                                         <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="COUNTRY"/> <span className="required">*</span></label>
                                                             <select className={`form-control input-bg-color-2 body-sub-titles ${incomplete && !country ? 'required-field' : 'border-0'}`}
                                                                 style={{height: '3.5rem'}} name="country" value={country}
                                                                 onChange={(e) => setCountry(e.target.value)} 
                                                             >
                                                                 <option className="mini-text-2" value="" disabled>Select Country </option>
                                                                 {countries.map((country: any) => (
                                                                 <option key={country.id} value={country.attributes.country}>{country.attributes.country}</option>))}
                                                             </select>
                                                     </td>
                                                     <td className="pb-5 pr-5 pl-xl-3 pl-md-3 pl-5">
                                                         <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="POST_CODE"/> <span className="required">*</span></label>
                                                         <input type="text" value={postcode}
                                                             className={`form-control input-bg-color-2 products-name ${incomplete && !postcode ? ' required-field' : 'border-0' }`}
                                                             name="postcode" placeholder={placeholderTranslations[locale]['postcode']}
                                                             onChange={(e) => setPostcode(e.target.value)}
                                                         />
                                                     </td>
                                                 </tr>
                                             </tbody>
                                           }
                                        </table>
                                    </div>
                                    <div className="row mt-2 mb-3 mx-2">
                                        <div className="col">
                                            <button type="submit" 
                                                className="custom-color-7 mediumfont rounded border-0 button-bg-color-1 pb-2 pt-2 px-5 d-flex align-items-center justify-content-center ubo-btn-mobile"
                                                onClick={(e) => handleProfileSubmit(e)}
                                            ><FormattedMessage id="SAVE"/></button>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table profile-table-1 password-wrapper coulmn-bg-color-1 rounded mt-2 rounded-2">
                                          {locale &&
                                              <tbody>
                                              <tr>
                                                  <th className="px-5 pt-3 pb-3 custom-color-3 regularfont subtitles border-top-0 border-bottom"><FormattedMessage id="CHANGE_PASSWORD"/></th>
                                              </tr>
                                              <div className='ml-4 mb-0 mt-4'>
                                                  {pwdmismatch && <p className='required-text' id='required'>* Password does not match</p>}
                                              </div>
                                              <tr className="single">
                                                  <td className="px-5">
                                                      <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="NEW_PASSWORD"/> <span className="required">*</span></label>
                                                      <span className="password-wrapper-field">
                                                          <div className='position-relative'>
                                                          <input type={newPwdVisible ? "text" : "password"} value={newpwd}
                                                              className={`form-control input-bg-color-2 products-name ${incompletePwd && !newpwd ? ' required-field' : 'border-0' }`} 
                                                              name="new-password" placeholder={placeholderTranslations[locale]['password']}
                                                              onChange={(e) => setNewpwd(e.target.value)}
                                                          />
                                                          <div className='position-absolute p-3' style={{right: 0, top: 0}}>
                                                          <span
                                                              className="password-visibility-toggle"
                                                              onClick={() => setNewPwdVisible(!newPwdVisible)}
                                                          >
                                                              {newPwdVisible ? (
                                                                  <i className="far fa-eye"></i>
                                                                  ) : (
                                                                  <i className="far fa-eye-slash"></i>
                                                              )}
                                                          </span>
                                                          </div>
                                                          </div>
                                                      </span> 
                                                  </td>
                                              </tr>
                                              <tr className="single">
                                                  <td className="px-5 pb-5">
                                                      <label className="custom-color-2 regularfont products-name pb-2"><FormattedMessage id="CONFIRM_PASSWORD"/> <span className="required">*</span></label>
                                                      <span className="password-wrapper-field">
                                                          <div className='position-relative'>

                                                          <input type={confrmpwdVisible ? "text" : "password"} value={confrmpwd}
                                                              className={`form-control input-bg-color-2 products-name ${incompletePwd && !confrmpwd ? ' required-field' : 'border-0' }`}
                                                              name="confirm-password" placeholder={placeholderTranslations[locale]['password']}
                                                              onChange={(e) => setConfrmpwd(e.target.value)}
                                                          />
                                                          <div className='position-absolute p-3' style={{right: 0, top: 0}}>
                                                          <span
                                                              className="password-visibility-toggle"
                                                              onClick={() => setConfrmpwdVisible(!confrmpwdVisible)}
                                                          >
                                                              {confrmpwdVisible ? (
                                                                  <i className="far fa-eye"></i>
                                                                  ) : (
                                                                  <i className="far fa-eye-slash"></i>
                                                              )}
                                                          </span>
                                                          </div>
                                                          </div>
                                                      </span>
                                                  </td>
                                              </tr>
                                          </tbody>
                                          }
                                        </table>
                                    </div>
                                    <div className="row mt-3 mx-2">
                                        <div className="col">
                                            <button type="submit" 
                                                className="custom-color-7 mediumfont rounded border-0 button-bg-color-1 pb-2 pt-2 px-5 d-flex align-items-center justify-content-center ubo-btn-mobile"
                                                onClick={(e) => handlePwdChange(e)}
                                            ><FormattedMessage id="CHANGE_PASSWORD"/></button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
export default Profile;