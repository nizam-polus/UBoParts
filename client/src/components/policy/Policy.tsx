import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import { FormattedMessage } from 'react-intl';
import Link from 'next/link';

function Policy() {

    return (
        <> 
            <div className="main-body pb-2 mb-5 px-0">
                <div className="container px-4 px-xl-0">
                    {/* <section className="about-content-wrapper">
                        <div className="row ps-5 pe-5 pt-4 pb-4">
                            <div className="col-12">
                                <p className="semifont heading_text custom-color-1"><FormattedMessage id="ABOUT_US"/></p>
                                <p className="body-sub-titles-1 lightfont custom-color-1"><FormattedMessage id="ABOUT_US_DISCRIPTION"/></p>
                            </div>
                        </div>
                    </section> */}
                    <section className="about-proffessionals-wrapper mt-4 pt-1 ">
                        <div className="row mt-3 mt-md-3 mt-xl-5">
                            <div className="col-12">
                                <p className="semifont text-size-3 custom-color-1 text-center pb-3 pt-3">General Policy UBO</p>
                            </div>
                        </div>
                       
                    </section>
                    <section className="contact-wrapper regular-font coulmn-bg-color-1 mt-5 p-5">
                        <div className='custom-color-2 '>
                            <h3> Information</h3>
                            <hr />
                            <span className='font-weight-bold'>Algemene voorwaarden UboTech E-mail: info@uboparts.com Website: www.uboparts.com</span><br />
                            <br />
                            <span className='font-weight-bold'>Definities</span><br /><br />

                            <p style={{paddingLeft: "10px"}}>
                                1. UboTech : UboTech , gevestigd te Rotterdam onder KvK nr. 75915820.
                            <br />
                                2. Klant: degene met wie UboTech een overeenkomst is aangegaan.
                            <br />
                                3. Partijen: UboTech en klant samen.
                            <br />
                                4. Consument: een klant die tevens een individu is en die als privépersoon handelt.
                            <br />
                            </p>

                            <span className='font-weight-bold'>Toepasselijkheid algemene voorwaarden</span><br /><br />

                            <p style={{paddingLeft: "10px"}}>
                                1. Deze voorwaarden zijn van toepassing op alle offertes, aanbiedingen, werkzaamheden, bestellingen, overeenkomsten en leveringen van diensten of producten door of namens UboTech .
                            <br />
                                2. Partijen kunnen alleen afwijken van deze voorwaarden als zij dat uitdrukkelijk en schriftelijk zijn overeengekomen.
                            <br />
                                3. Partijen sluiten de toepasselijkheid van aanvullende en/of afwijkende algemene voorwaarden van de klant of van derden uitdrukkelijk uit.
                            <br />
                            <br />
                            </p>

                            <h5>Prijzen</h5>
                            <span className='font-weight-bold'>Betalingen en betalingstermijn</span><br />
                            <br />
                            <p style={{paddingLeft: "10px"}}>
                                1. UboTech desire. <br /> When entering into the agreement, a down payment of up to 50% of the agreed amount is allowed
                            <br />
                                2. De klant dient betalingen achteraf binnen na levering te hebben voldaan.
                                <br />
                                3. Betalingstermijnen worden beschouwd als fatale betalingstermijnen. Dat betekent dat indien de klant het overeengekomen bedrag niet uiterlijk op de laatste dag van de betalingstermijn heeft voldaan, hij van rechtswege in
                                   verzuim en in gebreke is, zonder dat UboTech de klant een aanmaning hoeft te sturen c.q. in gebreke hoeft te stellen.
                                <br />
                                4. UboTech behoudt zich het recht voor om een levering afhankelijk te stellen van onmiddellijke betaling dan wel een <br />
                                   zekerheidstelling te eisen voor het totale bedrag van de diensten of producten
                                <br />
                            </p>
                            <br />
                            <span className='font-weight-bold'>Gevolgen niet tijdig betalen</span><br />
                            <br />
                            <p style={{paddingLeft: "10px"}}>
                                1. Betaalt de klant niet binnen de overeengekomen termijn, dan is UboTech gerechtigd de wettelijke rente van 2% per
                                maand voor niet-handelstransacties en de wettelijke rente van 8% per maand voor handelstransacties in rekening te brengen vanaf de dag dat de klant in verzuim is, waarbij een gedeelte van een maand voor een hele maand wordt gerekend
                            <br />
                                2.Wanneer de klant in verzuim is, is hij bovendien buitengerechtelijke incassokosten en eventuele schadevergoeding verschuldigd aan UboTech .
                                <br />
                                3. De incassokosten worden berekend aan de hand van het Besluit vergoeding voor buitengerechtelijke incassokosten.
                                4. Wanneer de klant niet tijdig betaalt, mag UboTech betalingsverplichting heeft voldaan.
                                   zijn verplichtingen opschorten totdat de klant aan zijn
                                <br />
                                5. In geval van liquidatie, faillissement, beslag of surseance van betaling aan de zijde van de klant, zijn de vorderingen
                                   van UboTech op de klant onmiddellijk opeisbaar.
                                <br />
                                6. Weigert de klant zijn medewerking aan de uitvoering van de overeenkomst door UboTech , dan is hij nog steeds <br />
                                verplicht de afgesproken prijs aan UboTech
                            </p>
                            <p>
                                <span className='font-weight-bold'>Herroepingsrecht</span> 
                                <p>te betalen.</p>
                                <br />
                            <p style={{paddingLeft: "10px"}}>
                                1. Een consument kan een online aankoop gedurende een bedenktijd van 14 dagen zonder opgave van reden ontbinden op voorwaarde dat:
                            <br />
                            <p style={{paddingLeft: "30px"}}>
                                de dienst geen logies, reis, restaurantbedrijf, vervoer, cateringopdracht of vorm van vrijetijdsbesteding betreft het geen (opdracht tot) spoedreparatie betreft <br />

                                het geen weddenschappen en/of loterijen betreft
                                <br />
                                
                                de consument niet heeft afgezien van zijn herroepingsrecht
                                <br />

                                het geen dienst betreft die met instemming van de klant volledig worden uitgevoerd binnen de 14 kalenderdagen bedenktijd en waarbij de klant uitdrukkelijk om de heeft verklaard van het herroepingsrecht af te zien
                                <br />
                               
                            </p>
                             2.De bedenktijd van 14 dagen zoals in lid 1 genoemd, vangt aan:
                                <br />
                                <p style={{paddingLeft: "30px"}}>
                                zodra de consument de overeenkomst levering van de dienst heeft gesloten
                                <br />
                                zodra de consument bevestigd heeft dat hij digitale inhoud via internet gaat afnemen
                                </p>
                                3. De consument kan zijn beroep op het herroepingsrecht kenbaar maken via info@uboparts.com, indien gewenst met behulp van het herroepingsformulier dat via de website van UboTech , www.uboparts.com, kan worden gedownload.
                                <br />
                                4. Wanneer de klant niet tijdig betaalt, mag UboTech betalingsverplichting heeft voldaan.
                                   zijn verplichtingen opschorten totdat de klant aan zijn
                                <br />
                            </p>
                            </p>

                            <h5>Opschortingsrecht</h5>
                            <p>
                            Tenzij de klant een consument is, doet de klant afstand van het recht om de nakoming van enige uit deze overeenkomst voortvloeiende verbintenis op te schorten.
                            </p>
                            <br />
                            <h5>Verrekening</h5>
                            <p>
                            Tenzij de klant een consument is, doet de klant afstand van zijn recht om een schuld aan UboTech een vordering op UboTech .
                            te verrekenen met
                            </p>
                            <br />
                            <h5>Verzekering</h5>
                            <p className='pl-3'>
                                1. De klant verplicht zich de volgende zaken voldoende te verzekeren en verzekerd te houden tegen onder andere brand, ontploffings- en waterschade evenals diefstal:
                                <p className='pl-4'>
                                    geleverde zaken die noodzakelijk zijn voor de uitvoering van de onderliggende overeenkomst
                                    <br />
                                    zaken van UboTech die bij de klant aanwezig zijn
                                    <br />
                                    zaken die onder eigendomsvoorbehoud zijn geleverd
                                </p>
                                2. De klant geeft op eerste verzoek van UboTech de polis van deze verzekeringen ter inzage.
                            </p>
                            <br />
                            <h5>Garantie</h5>
                            <p className='pl-3'>
                            Wanneer partijen een overeenkomst met een dienstverlenend karakter zijn aangegaan, bevat deze voor UboTech enkel een inspanningsverplichting en dus geen resultaatsverplichting.
                            </p>
                            <br />
                            <h5>Uitvoering van de overeenkomst</h5>
                            <p className='pl-3'>
                                1. UboTech uit. <br />
                                2. UboTech
                            </p>
                            voert de overeenkomst naar beste inzicht en vermogen en overeenkomstig de eisen van goed vakmanschap
                            <br />
                            heeft het recht om de overeengekomen dienstverlening (gedeeltelijk) te laten verrichten door derden.
                             <br />
                             <p className='pl-3'>
                                3. De uitvoering van de overeenkomst geschiedt in onderling overleg en na schriftelijk akkoord en betaling van het eventueel afgesproken voorschot door de klant. <br />
                                4. Het is de verantwoordelijkheid van de klant dat UboTech tijdig kan beginnen aan de uitvoering van de overeenkomst.
                                <br />
                                5. Indien de klant er niet voor heeft gezorgd dat UboTech tijdig kan beginnen aan de uitvoering van de overeenkomst, <br />
                                komen de daaruit voortvloeiende extra kosten en/of extra uren voor rekening van de klant.
                            </p>
                            <br />
                            <h5>Informatieverstrekking door de klant</h5>
                            <br />
                            <p className='pl-4'>
                                1. De klant stelt alle informatie, gegevens en bescheiden die relevant zijn voor de correcte uitvoering van de overeenkomst tijdig en in gewenste vorm en op gewenste wijze beschik-baar aan UboTech . <br />
                                2. De klant staat in voor de juistheid, volledigheid en betrouwbaarheid van de ter beschikking gestelde informatie, gegevens en bescheiden, ook indien deze van derden afkomstig zijn, voor zover uit de aard van de overeenkomst niet anders voortvloeit. <br />
                                3. Indien en voor zover de klant dit verzoekt, retourneert UboTech <br />
                                4. Stelt de klant niet, niet tijdig of niet behoorlijk de door UboTech
                            </p>
                            de betreffende bescheiden. <br />
                            redelijkerwijs verlangde informatie, gegevens of <br />
                            bescheiden beschikbaar en loopt de uitvoering van de overeenkomst hierdoor vertraging op, dan komen de daaruit voortvloeiende extra kosten en extra uren voor rekening van de klan
                            <br />
                            <h5>Vrijwaring</h5>
                            <br />
                            <p className='pl-4'>
                                De klant vrijwaart UboTech producten en/of diensten.
                            </p>
                            <h5>Klachten</h5>
                            <br />
                            <p className='pl-4'>
                            tegen alle aanspraken van derden die verband houden met de door UboTech <br />
                            geleverde
                            <br />
                            <p className='pl-3'>
                                1. De klant dient een door UboTech eventuele tekortkomingen. <br />
                                geleverd product of verleende dienst zo spoedig mogelijk te onderzoeken op
                                2. Beantwoordt een geleverd product of verleende dienst niet aan hetgeen de klant redelijkerwijs van de overeenkomst
                                mocht verwachten, dan dient de klant UboTech daarvan zo spoedig mogelijk, doch in ieder geval binnen 1 maand na
                                constatering van de tekortkomingen, op de hoogte te stellen. <br />
                                3. Consumenten dienen UboTech hoogte te stellen.  <br />
                                uiterlijk binnen 2 maanden na constatering van de tekortkomingen hiervan op de
                                <br />
                                4. De klant geeft daarbij een zo gedetailleerd mogelijke omschrijving van de tekort-koming, zodat UboTech hierop adequaat te reageren.
                                <br />
                                5. De klant dient aan te tonen dat de klacht betrekking heeft op een overeenkomst tussen partijen.
                                <br />
                                6. Indien een klacht betrekking heeft op lopende werkzaamheden, kan dit er in ieder geval niet toe leiden dat UboTech gehouden kan worden om andere werkzaamheden te verrichten dan zijn overeengekomen.
                            </p>
                            </p>

                            <h5>Ingebrekestelling</h5>
                            <br />
                            <p className='pl-4'>
                                1. De klant dient ingebrekestellingen schriftelijk kenbaar te maken aan UboTech. <br />
                                2. Het is de verantwoordelijkheid van de klant dat een ingebrekestelling UboTech
                            </p>
                            ook daadwerkelijk (tijdig) bereikt.

                            <h5>Hoofdelijke aansprakelijkheid klant</h5>
                            <br />
                            <p className='pl-4'>
                            Als UboTech een overeenkomst aangaat met meerdere klanten, is ieder van hen hoofdelijk aansprakelijk voor de
                            volledige bedragen die zij op grond van die overeenkomst aan UboTech
                            </p>

                            <h5>Aansprakelijkheid UboTech</h5>
                            <br />
                            verschuldigd zijn.
                            <br />
                            <p className='pl-4'>
                                1. UboTech is uitsluitend aansprakelijk voor enige schade die de klant lijdt indien en voor zover die schade is
                                veroorzaakt door opzet of bewuste roekeloosheid. <br />
                                2. Indien UboTech aansprakelijk is voor enige schade, is het slechts aansprakelijk voor directe schade die voortvloeit
                                uit of verband houdt met de uitvoering van een overeenkomst. <br />
                                3. UboTech is nooit aansprakelijk voor indirecte schade, zoals gevolgschade, gederfde winst, gemiste besparingen of
                                schade aan derden. <br />
                                4. Indien UboTech aansprakelijk is, is deze aansprakelijkheid beperkt tot het bedrag dat door een gesloten (beroeps)
                                aansprakelijkheidsverzekering wordt uitbetaald en bij gebreke van (volledige) uitkering door een verzekeringsmaatschappij van het schadebedrag is de aansprakelijkheid beperkt tot het (gedeelte van het) factuurbedrag waarop de aansprakelijkheid betrekking heeft. 
                                <br />
                                5. Alle afbeeldingen, foto’s, kleuren, tekeningen, omschrijvingen op de website of in een catalogus zijn slechts indicatief en gelden slechts bij benadering en kunnen geen aanleiding zijn tot schadevergoeding en/of (gedeeltelijke) ontbinding van de overeenkomst en/of opschorting van enige verplichting.
                            </p>
                            <h5>Vervaltermijn</h5>
                            <br />
                            <p className='pl-4'>
                            Elk recht van de klant op schadevergoeding van UboTech vervalt in elk geval 12 maanden na de gebeurtenis waaruit
                            de aansprakelijkheid direct of indirect voortvloeit. Hiermee wordt niet uitgesloten het bepaalde in artikel 6:89 van het Burgerlijk Wetboek.
                            </p>

                            <h5>Recht op ontbinding</h5>
                            <br />
                            <p className='pl-4'>
                                1. De klant heeft het recht de overeenkomst te ontbinden wanneer UboTech toerekenbaar tekortschiet in de nakoming
                                van zijn verplichtingen, tenzij deze tekortkoming, gezien haar bijzondere aard of geringe betekenis, de ontbinding niet rechtvaardigt. 
                                <br />
                                2. Is de nakoming van de verplichtingen door UboTech niet blijvend of tijdelijk onmogelijk, dan kan ontbinding pas
                                plaatsvinden nadat UboTech in verzuim is.
                                <br />
                                3. UboTech heeft het recht de overeenkomst met de klant te ontbinden, indien de klant zijn verplichtingen uit de
                                overeenkomst niet volledig of niet tijdig nakomt, dan wel indien UboTech kennis heeft genomen van
                                omstandigheden die hem goede grond geven om te vrezen dat de klant zijn verplichtingen niet behoorlijk zal kunnen nakomen.
                            </p>
                            <br />

                            <h5>Overmacht</h5>
                            <br />
                            <p className='pl-4'>
                                1. In aanvulling op het bepaalde in artikel 6:75 Burgerlijk Wetboek geldt dat een tekortkoming van UboTech in de
                                nakoming van enige verplichting ten aanzien van de klant niet aan UboTech kan worden toegerekend in een van de
                                wil van UboTech onafhankelijke situatie, waardoor de nakoming van zijn verplichtingen ten aanzien van de klant
                                geheel of gedeeltelijk wordt verhinderd of waardoor de nakoming van zijn verplichtingen in redelijk-heid niet van
                                UboTech kan worden verlangd. 
                                <br />
                                2. Tot de in lid 1 genoemde overmachtsituatie worden ook - doch niet uitsluitend - gerekend: noodtoestand (zoals burgeroorlog, opstand, rellen, natuurrampen, etc.); wanprestaties en overmacht van toeleveranciers, bezorgers of andere derden; onverwachte stroom-, elektriciteits- internet-, computer- en telecomstoringen; computer-virussen, stakingen, overheidsmaatregelen, onvoorziene vervoersproblemen, slechte weersomstandigheden en werkonderbrekingen.
                                <br />
                                3. Indien zich een overmachtsituatie voordoet waardoor UboTech 1 of meer verplichtingen naar de klant niet kan
                                nakomen, dan worden die verplichtingen opgeschort totdat UboTech er weer aan kan voldoen.
                                <br />
                                4. Vanaf het moment dat een overmachtsituatie ten minste 30 kalenderdagen heeft geduurd, mogen beide partijen de overeenkomst schriftelijk geheel of gedeeltelijk ontbinden.
                                <br />
                                5. UboTech is in een overmachtsituatie geen enkele (schade)vergoeding verschuldigd, ook niet als het als gevolg van
                                de overmachttoestand enig voordeel geniet.
                            </p>
                            <br />

                            <h5>Wijziging van de overeenkomst</h5>
                            <br />
                            <p className='pl-4'>
                                1.Indien na het afsluiten van de overeenkomst voor de uitvoering ervan het nodig blijkt om de inhoud ervan te wijzigen of aan te vullen, passen partijen tijdig en in onderling overleg de overeenkomst dienovereenkomstig aan. 
                                <br />
                                2. Voorgaand lid is niet van toepassing bij producten die zijn afgenomen in een fysieke winkel.
                            </p>
                            <br />

                            <h5>Wijziging algemene voorwaarden</h5>
                            <br />
                            <p className='pl-4'>
                                1. UboTech is gerechtigd deze algemene voorwaarden te wijzigen of aan te vullen.
                                <br />
                                2. Wijzigingen van ondergeschikt belang kunnen te allen tijde worden doorgevoerd.
                                <br />
                                3. Grote inhoudelijke wijzigingen zal UboTech zoveel mogelijk vooraf met de klant bespreken.
                                <br />
                                4. Consumenten zijn gerechtigd bij een wezenlijke wijziging van de algemene voorwaarden de overeenkomst op te zeggen.
                            </p>
                            <br />
                            <h5>Overgang van rechten</h5>
                            <br />
                            <p className='pl-4'>
                                1.Rechten van de klant uit een overeenkomst tussen partijen kunnen niet aan derden worden overgedragen zonder de voorafgaande schriftelijke instemming van UboTech .
                                <br />
                                2. Deze bepaling geldt als een beding met goederenrechtelijke werking zoals bedoeld in artikel 3:83, tweede lid, Burgerlijk Wetboek.
                            </p>
                            <br />
                            <h5>Gevolgen nietigheid of vernietigbaarheid</h5>
                            <br />
                            <p className='pl-4'>
                                1.Wanneer één of meerdere bepalingen van deze algemene voorwaarden nietig of vernietigbaar blijken, dan tast dit de overige bepalingen van deze voorwaarden niet aan.
                                <br />
                                2. Een bepaling die nietig of vernietigbaar is, wordt in dat geval vervangen door een bepaling die het dichtst in de buurt
                                komt van wat UboTech bij het opstellen van de voorwaarden op dat punt voor ogen had.
                            </p>
                            <br />

                            <h5>Toepasselijk recht en bevoegde rechter</h5>
                            <br />
                            <p className='pl-4'>
                                1.Op iedere overeenkomst tussen partijen is uitsluitend het Nederlands recht van toepassing.
                                <br />
                                2. De Nederlandse rechter in het arrondissement waar UboTech is gevestigd / praktijk houdt / kantoor houdt is
                                exclusief bevoegd om kennis te nemen van eventuele geschillen tussen partijen, tenzij de wet dwingend anders voorschrijft.
                            </p>
                            <br />
                            Opgesteld op 01 oktober 2022.
                        </div>
                    </section>
                </div>
                <section className="contact-wrapper coulmn-bg-color-1 mt-5">
                    <div className="container-fluid">
                        <div className="container">
                            <div className="col p-5">
                                <div className='text-center'>
                                <h3>Still Have Questions?</h3><br />
                                <p className='font-weight-normal'>We will be happy to answer any questions you may have.</p>
                                </div>
                            <div className="col text-center p-xl-5 p-md-5">
                                    <a href="/contact_us" className=" custom-color-11 button-bg-color-1 lightfont body-sub-titles px-5 pt-4 pb-4 ps-3 pe-3 rounded button-color"><FormattedMessage id="CONTACT_US" /></a>
                            </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
export default Policy;