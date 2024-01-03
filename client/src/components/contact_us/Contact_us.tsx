import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import AppImage from '../shared/AppImage';
import { FormattedMessage } from 'react-intl';
import { UserContext } from '../account_/UserContext';
import APIs from '~/services/apiService';
import { toast } from 'react-toastify';
import Link from 'next/link';

function Contact_us() {

    const { language } = UserContext();

    const [name, setName] = useState<any>("");
    const [email, setEmail] = useState<any>("");
    const [subject, setSubject] = useState<any>("");
    const [message, setMessage] = useState<any>("");
    const [incomplete, setIncomplete] = useState<boolean>(false);

    const checkFormStatus = () => {
        let incomplete = true;
        incomplete = !(!!name && !!email && !!subject && !!message);
        setIncomplete(incomplete);
        return incomplete
    }

    const handleFormSubmit = () => {
        let incomplete = checkFormStatus();
        console.log(incomplete)
        if (!incomplete) {
            let contactData = {
                contactus: {
                    name,
                    email,
                    subject,
                    message
                },
                lang: language.value
            };
            APIs.contactUs(contactData)
            .then(() => {
                toast.success(() => ( <FormattedMessage id="FORM_SUCCESS" /> ));
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
            })
            .catch(err => {
                console.log(err);
                toast.error(<FormattedMessage id="SOMETHING_WRONG" />);
            })
        }
    }

    return (
        <>
            <div className="main-body pb-2 px-0">
                <div className="container px-4 px-xl-0">
                    <section className="about-proffessionals-wrapper mt-4 pt-1 ">
                        <div className="row mt-3 mt-md-3 mt-xl-5">
                            <div className="col-12">
                                <p className="semifont text-size-3 custom-color-1 text-center pb-3 pt-3">
                                    <FormattedMessage id="CONTACT_US" />
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <div className="block mb-5">
                <div className="container container--max--lg">
                    <div className="card contacts regularfont">
                        <div className="contacts__map">
                            <iframe
                                title="Google Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2433.033668564033!2d4.841715912393551!3d52.42418764320198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5e2cf31db3269%3A0x5e1e44cfad76c89a!2sZomerdijk%2011%2C%201505%20HW%20Zaandam%2C%20Netherlands!5e0!3m2!1sen!2sin!4v1698324709289!5m2!1sen!2sin"
                                width="100%"
                                height="450"
                            ></iframe>
                        </div>
                        <div className="card-body card-body--padding--2">
                            <div className="row">
                                <div className="col-12 col-lg-6 pb-4 pb-lg-0">
                                    <div className="mr-1">
                                        <h4 className="contact-us__header card-title">
                                            <FormattedMessage id="OUR_ADDRESS" />
                                        </h4>

                                        <div className="contact-us__address">
                                            <p>
                                                UboParts,  Rotterdam <br />
                                                The Netherlands
                                                <br />
                                                Email:<Link href="mailto:info@uboparts.com">info@uboparts.com</Link> 
                                                <br />
                                                Phone Number: +316 334-907-82
                                            </p>

                                            <p>
                                                <strong>
                                                    <FormattedMessage id="OPENING_HOURS" />
                                                </strong>
                                                <br />
                                                Monday to Friday: 8h00-17h00
                                                <br />
                                                Saturday: Closed
                                                <br />
                                                Sunday: Closed
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-lg-6">
                                    <div className="ml-1">
                                        <h4 className="contact-us__header card-title">
                                            <FormattedMessage id="LEAVE_US_A_MESSAGE" />
                                        </h4>

                                        <form>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="form-name">
                                                        <FormattedMessage id="YOUR_NAME" />
                                                    </label>
                                                    <span className="required">*</span>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => setName(e.target.value)}
                                                        className={`form-control input-bg-color-2 products-name ${
                                                            incomplete && !name ? "required-field" : "border-0"
                                                        }`}
                                                        name="name"
                                                        placeholder="Jhon cina"
                                                        value={name}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                <label htmlFor="form-name"><FormattedMessage id="EMAIL" /></label>
                                                    <span className="required">*</span>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => {
                                                            setEmail(e.target.value.toLowerCase());
                                                        }}
                                                        className={`form-control input-bg-color-2 products-name ${
                                                            incomplete && !email ? "required-field" : "border-0"
                                                        }`}
                                                        name="email"
                                                        placeholder="jhon@gmail.com"
                                                        value={email}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <FormattedMessage id="SUBJECT" />
                                                <span className="required">*</span>
                                                <input
                                                    type="text"
                                                    onChange={(e) => setSubject(e.target.value)}
                                                    className={`form-control input-bg-color-2 products-name ${
                                                        incomplete && !subject ? "required-field" : "border-0"
                                                    }`}
                                                    name="subject"
                                                    placeholder={language.value == 'nl' ? "onderwerp.." : "subject"}
                                                    value={subject}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <FormattedMessage id="MESSAGE" />
                                                <span className="required">*</span>
                                                <textarea
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    className={`form-control input-bg-color-2 products-name ${
                                                        incomplete && !message ? "required-field" : "border-0"
                                                    }`}
                                                    name="message"
                                                    placeholder={language.value == 'nl' ? "bericht..." : "Message..."}
                                                    value={message}
                                                />
                                            </div>
                                            <a
                                                className="button-bg-color-1 d-block lightfont pb-3 pt-3 px-5 rounded ubo-btn-full"
                                                onClick={handleFormSubmit}
                                            >
                                                <FormattedMessage id="SEND" />
                                            </a>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Contact_us;