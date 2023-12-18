import React, { useCallback, useEffect, useState } from 'react';
import AppLink from '~/components/shared/AppLink';
import { FormattedMessage } from 'react-intl';
import Link from 'next/link';

function Policy() {

    return (
        <>
            <div className="main-body pb-2 mb-5 px-0">
                <div className="container px-4 px-xl-0">
                    <section className="about-proffessionals-wrapper mt-4 pt-1 ">
                        <div className="row mt-3 mt-md-3 mt-xl-5">
                            <div className="col-12">
                                <p className="semifont text-size-3 custom-color-1 text-center pb-3 pt-3">Terms And Conditions</p>
                            </div>
                        </div>
                    </section>
                    <section className="contact-wrapper regular-font coulmn-bg-color-1 mt-5 p-5">
                        <div className='custom-color-2 '>
                            <h3> ALGEMENE VOORWAARDEN WEBSHOP (B2C)</h3>
                            <hr />
                            <br />
                            <span className='font-weight-bold'>Artikel 1 - Definities</span><br /><br />

                            <p style={{ paddingLeft: "10px" }}>
                                1. UboTech , gevestigd te Rotterdam , KvK-nummer 75915820, wordt in deze algemene voorwaarden aangeduid als verkoper.
                                <br />
                                2. De wederpartij van verkoper wordt in deze algemene voorwaarden aangeduid als koper.
                                <br />
                                3. Partijen zijn verkoper en koper samen.
                                <br />
                                4. Met de overeenkomst wordt bedoeld de koopovereenkomst tussen partijen.
                                <br />
                            </p>

                            <span className='font-weight-bold'>Artikel 2 - Toepasselijkheid algemene voorwaarden</span><br /><br />

                            <p style={{ paddingLeft: "10px" }}>
                                1. Deze voorwaarden zijn van toepassing op alle offertes, aanbiedingen, overeenkomsten en leveringen van diensten of goederen door of namens verkoper.
                                <br />
                                2. 2. Afwijken van deze voorwaarden kan alleen als dat uitdrukkelijk én schriftelijk door partijen is overeengekomen.
                                <br />
                            </p>

                            <h5>Artikel 3 - Betaling</h5>
                            <br />
                            <p style={{ paddingLeft: "10px" }}>
                                1. De volledige koopsom wordt altijd meteen in de webshop voldaan. Bij reserveringen wordt in sommige gevallen een aanbetaling verwacht. In dat geval krijgt de koper een bewijs van de reservering en de vooruitbetaling.
                                <br />
                                2. Betaalt koper niet op tijd, dan is hij in gebreke. Blijft koper in gebreke, dan is verkoper gerechtigd de verplichtingen op te schorten totdat koper aan zijn betalingsverplichting heeft voldaan.
                                <br />
                                3. Blijft koper in gebreke, dan zal verkoper tot invordering overgaan. De kosten met betrekking tot die invordering komen voor rekening van de koper. Deze incassokosten worden berekend aan de hand van het Besluit vergoeding voor buitengerechtelijke incassokosten.
                                <br />
                                4. In geval van liquidatie, faillissement, beslag of surseance van betaling van de koper zijn de vorderingen van verkoper op de koper onmiddellijk opeisbaar.
                                <br />
                                5. Weigert koper zijn medewerking aan de uitvoering van de opdracht door verkoper, dan is hij nog steeds verplicht de afgesproken prijs aan verkoper te betalen.
                            </p>
                            <br />
                            <span className='font-weight-bold'>Artikel 4 - Aanbiedingen, offertes en prijs</span><br />
                            <br />

                            <p style={{ paddingLeft: "10px" }}>
                                1. Aanbiedingen zijn vrijblijvend, tenzij in het aanbod een termijn van aanvaarding is genoemd. Wordt het aanbod niet binnen die gestelde termijn aanvaard, dan vervalt het aanbod.
                                <br />
                                2. Levertijden in offertes zijn indicatief en geven koper bij overschrijding daarvan geen recht op ontbinding of schadevergoeding, tenzij partijen uitdrukkelijk én schriftelijk anders zijn overeengekomen.
                                <br />
                                3. Aanbiedingen en offertes gelden niet automatisch voor nabestellingen. Partijen moeten dit uitdrukkelijk én schriftelijk overeenkomen.
                                <br />
                                4. De op aanbiedingen, offertes en facturen genoemde prijs bestaat uit de koopprijs inclusief de verschuldigde btw en eventuele andere overheidsheffingen.
                            </p>

                            <h5>Artikel 5 - Herroepingsrecht</h5>
                            <br />
                            <p style={{ paddingLeft: "10px" }}>
                                1. De consument krijgt het recht om na ontvangst van de bestelling binnen dagen de overeenkomst zonder opgave van redenen te ontbinden (herroepingsrecht). De termijn begint te lopen vanaf het moment dat de (gehele) bestelling door de consument is ontvangen.
                                <br />
                                2. Er bestaat geen herroepingsrecht wanneer de producten volgens zijn specificaties op maat zijn gemaakt of slechts kort houdbaar zijn.
                                <br />
                                3. De consument kan een herroepingsformulier van verkoper gebruiken. Verkoper is gehouden dit terstond na de vraag van koper aan koper ter beschikking te stellen.
                                <br />
                                4. Tijdens de bedenktijd zal de consument zorgvuldig omgaan met het product en de verpakking. Hij zal het product slechts in die mate uitpakken of gebruiken voor zover dat nodig is om te kunnen beoordelen of hij het product wenst te behouden. Indien hij van zijn herroepingsrecht gebruik maakt, zal hij het ongebruikte en onbeschadigde product te behouden. Indien hij van zijn herroepingsrecht gebruik maakt, zal hij het ongebruikte en onbeschadigde product met alle geleverde toebehoren en - indien redelijkerwijze mogelijk - in de originele verzendverpakking aan verkoper retourneren, conform de door de ondernemer verstrekte redelijke en duidelijke instructies.
                            </p>
                            <br />

                            <h5>Artikel 6 - Wijziging van de overeenkomst</h5>
                            <br />
                            <p style={{ paddingLeft: "10px" }}>
                                1. Indien tijdens de uitvoering van de overeenkomst blijkt dat het voor een behoorlijke uitvoering van de opdracht noodzakelijk is om de te verrichten werkzaamheden te wijzigen of aan te vullen, passen partijen tijdig en in onderling overleg de overeenkomst dienovereenkomstig aan.
                                <br />
                                2. Indien partijen overeenkomen dat de overeenkomst wordt gewijzigd of aangevuld, kan het tijdstip van voltooiing van de uitvoering daardoor worden beïnvloed. Verkoper stelt koper hiervan zo spoedig mogelijk op de hoogte.
                                <br />
                                3. Indien de wijziging van of aanvulling op de overeenkomst financiële en/of kwalitatieve consequenties heeft, licht verkoper koper hierover vooraf schriftelijk in.
                                <br />
                                4. Indien partijen een vaste prijs zijn overeengekomen, geeft verkoper daarbij aan in hoeverre de wijziging of aanvulling van de overeenkomst een overschrijding van deze prijs tot gevolg heeft.
                                <br />
                                5. In afwijking van het bepaalde in het derde lid van dit artikel kan verkoper geen meerkosten in rekening brengen indien de wijziging of aanvulling het gevolg is van omstandigheden die aan hem kunnen worden toegerekend.
                            </p>


                            <h5>Artikel 7 - Oplevering en risico-overgang</h5>
                            <br />
                            <p className='pl-2'>
                                1. Zodra het gekochte door de koper in ontvangst is genomen, gaat het risico over van verkoper naar koper.
                            </p>
                            <h5>Artikel 8 - Onderzoek en reclames</h5>
                            <br />
                            <p style={{ paddingLeft: "10px" }}>
                                1. Koper is gehouden het geleverde op het moment van (af)levering, maar in ieder geval binnen zo kort mogelijke termijn te (doen) onderzoeken. Daarbij behoort koper te onderzoeken of kwaliteit en kwantiteit van het geleverde overeenstemmen met hetgeen partijen zijn overeengekomen, althans dat kwaliteit en kwantiteit voldoen aan de eisen die daaraan in het normale (handels)verkeer gelden.
                                <br />
                                2. Reclames met betrekking tot beschadigingen, tekorten of verlies van geleverde goederen moeten binnen 10 werkdagen na de dag van aflevering van de goederen door koper schriftelijk bij verkoper worden ingediend.
                                <br />
                                3. Bij gegrondverklaring van de klacht binnen de gestelde termijn heeft verkoper het recht om óf te herstellen, óf opnieuw te leveren, óf om van levering af te zien en koper een creditnota te sturen voor dat deel van de koopprijs.
                                <br />
                                4. Geringe en/of in de branche gebruikelijke afwijkingen en verschil in kwaliteit, aantal, maat of afwerking kunnen niet aan verkoper worden tegengeworpen.
                                <br />
                                5. Klachten met betrekking tot een bepaald product hebben geen invloed op andere producten dan wel onderdelen behorende bij diezelfde overeenkomst.
                                <br />
                                6. Na het verwerken van de goederen bij koper worden geen reclames meer geaccepteerd.
                            </p>


                            <h5>Artikel 9 - Monsters en modellen</h5>
                            <br />
                            <p style={{ paddingLeft: "10px" }}>
                                1. Is aan koper een monster of model getoond of verstrekt, dan wordt het vermoed slechts als aanduiding te zijn verstrekt zonder dat de te leveren zaak daaraan behoeft te beantwoorden. Dit is anders als partijen uitdrukkelijk zijn overeengekomen dat de te leveren zaak wel daarmee zal overeenstemmen.
                                <br />
                                2. Bij overeenkomsten ter zake van een onroerende zaak wordt vermelding van de oppervlakte of andere afmetingen en aanduidingen eveneens vermoed slechts als aanduiding bedoeld te zijn, zonder dat de te leveren zaak daaraan behoeft te beantwoorden.
                            </p>
                            <br />

                            <h5>Artikel 10 - Levering</h5>
                            <br />
                            <p style={{ paddingLeft: "10px" }}>
                                1. Levering geschiedt ‘af fabriek/winkel/magazijn’. Dit houdt in dat alle kosten voor koper zijn.
                                <br />
                                2. Koper is verplicht de zaken af te nemen op het moment dat verkoper deze bij hem aflevert of doet afleveren, dan wel op het moment waarop deze zaken hem volgens de overeenkomst ter beschikking worden gesteld.
                                <br />
                                3. Indien koper afname weigert of nalatig is in het verstrekken van informatie of instructies die noodzakelijk zijn voor de levering, is verkoper gerechtigd de zaak voor rekening en risico van koper op te slaan.
                                <br />
                                4. Indien de zaken worden bezorgd, is verkoper gerechtigd eventuele bezorgkosten in rekening te brengen.
                                <br />
                                5. Indien verkoper gegevens van koper nodig heeft voor de uitvoering van de overeenkomst, vangt de levertijd aan nadat koper deze gegevens aan verkoper ter beschikking heeft gesteld.
                                <br />
                                6. Een door verkoper opgegeven termijn voor levering is indicatief. Dit is nooit een fatale termijn. Bij overschrijding van de termijn moet koper verkoper schriftelijk in gebreke stellen.
                                <br />
                                7. Verkoper is gerechtigd de zaken in gedeelten te leveren, tenzij partijen dit anders schriftelijk zijn overeengekomen of aan deellevering geen zelfstandige waarde toekomt. Verkoper is bij levering in delen gerechtigd deze delen afzonderlijk te factureren.
                            </p>
                            <h5>Artikel 11 - Overmacht</h5>
                            <p style={{ paddingLeft: "10px" }}>
                                1. Kan verkoper niet, niet tijdig of niet behoorlijk aan zijn verplichtingen uit de overeenkomst voldoen door overmacht, dan is hij niet aansprakelijk voor door koper geleden schade.
                                <br />
                                2. Onder overmacht verstaan partijen in ieder geval iedere omstandigheid waarmee verkoper ten tijde van het aangaan van de overeenkomst geen rekening kon houden en ten gevolge waarvan de normale uitvoering van de overeenkomst redelijkerwijs niet door koper kan worden verlangd zoals bijvoorbeeld ziekte, oorlog of oorlogsgevaar, burgeroorlog en oproer, molest, sabotage, terrorisme, energiestoring, overstroming, aardbeving, brand, bedrijfsbezetting, werkstakingen, werkliedenuitsluiting, gewijzigde overheidsmaatregelen, transportmoeilijkheden, en andere storingen in het bedrijf van verkoper.
                                <br />
                                3. Voorts verstaan partijen onder overmacht de omstandigheid dat toeleveringsbedrijven waarvan verkoper afhankelijk is voor de uitvoering van de overeenkomst, niet aan de contractuele verplichtingen jegens verkoper voldoen, tenzij zulks aan verkoper te verwijten is.
                                <br />
                                4. Indien zich een situatie als hiervoor bedoeld voordoet als gevolg waarvan verkoper niet aan zijn verplichtingen jegens koper kan voldoen, dan worden die verplichtingen opgeschort zolang verkoper niet aan zijn verplichtingen kan voldoen. Indien de in de vorige zin bedoelde situatie 30 kalenderdagen heeft geduurd, hebben partijen het recht de overeenkomst schriftelijk geheel of gedeeltelijk te ontbinden.
                                <br />
                                5. Ingeval de overmacht langer dan drie maanden voortduurt, heeft koper het recht de overeenkomst met onmiddellijke ingang te ontbinden. Ontbinding kan alleen via een aangetekende brief.
                            </p>
                            <h5>Artikel 12 - Overdracht van rechten</h5>
                            <p className='pl-4'>
                                1. Rechten van een partij uit deze overeenkomst kunnen niet worden overgedragen zonder de voorafgaande schriftelijke instemming van de andere partij. Deze bepaling geldt als een beding met goederenrechtelijke werking zoals bedoeld in artikel 3:83, tweede lid, Burgerlijk Wetboek.
                            </p>
                            <br />
                            <h5>Artikel 13 - Eigendomsvoorbehoud en retentierecht</h5>
                            <p style={{ paddingLeft: "10px" }}>
                                1. De bij verkoper aanwezige zaken en geleverde zaken en onderdelen blijven eigendom van verkoper totdat koper de gehele afgesproken prijs heeft betaald. Tot die tijd kan verkoper zich beroepen op zijn eigendomsvoorbehoud en de zaken terugnemen.
                                <br />
                                2. Indien de overeengekomen vooruit te betalen bedragen niet of niet op tijd worden voldaan, heeft verkoper het recht om de werkzaamheden op te schorten totdat het overeengekomen deel alsnog is voldaan. Er is dan sprake van schuldeisersverzuim. Een verlate levering kan in dat geval niet aan verkoper worden tegengeworpen.
                                <br />
                                3. Verkoper is niet bevoegd de onder zijn eigendomsvoorbehoud vallende zaken te verpanden noch op enige andere wijze te bezwaren.
                                <br />
                                4. Verkoper verplicht zich de onder eigendomsvoorbehoud aan koper geleverde zaken te verzekeren en verzekerd te houden tegen brand, ontploffings- en waterschade alsmede tegen diefstal en de polis op eerste verzoek ter inzage te geven.
                                <br />
                                5. Indien zaken nog niet zijn geleverd, maar de overeengekomen vooruitbetaling of prijs niet conform afspraak is voldaan, heeft verkoper het recht van retentie. De zaak wordt dan niet geleverd totdat koper volledig en conform afspraak heeft betaald.
                                <br />
                                6. In geval van liquidatie, insolventie of surseance van betaling van koper zijn de verplichtingen van koper onmiddellijk opeisbaar.
                            </p>
                            <h5>Artikel 14 - Aansprakelijkheid</h5>
                            <p style={{ paddingLeft: "10px" }}>
                                1. Iedere aansprakelijkheid voor schade, voortvloeiende uit of verband houdende met de uitvoering van een overeenkomst, is steeds beperkt tot het bedrag dat in het desbetreffende geval door de gesloten aansprakelijkheidsverzekering(en) wordt uitbetaald. Dit bedrag wordt vermeerderd met het bedrag van het eigen risico volgens de desbetreffende polis.
                                <br />
                                2. Niet uitgesloten is de aansprakelijkheid van verkoper voor schade die het gevolg is van opzet of bewuste roekeloosheid van verkoper of zijn leidinggevende ondergeschikten.
                            </p>
                            <h5>Artikel 15 - Klachtplicht</h5>
                            <p style={{ paddingLeft: "10px" }}>
                                1. Koper is verplicht klachten over de verrichte werkzaamheden direct te melden aan verkoper. De klacht bevat een zo gedetailleerd mogelijke omschrijving van de tekortkoming, zodat verkoper in staat is hierop adequaat te reageren.
                                <br />
                                2. Is een klacht gegrond, dan is verkoper gehouden het goed te herstellen en eventueel te vervangen.
                            </p>
                            <h5>Artikel 16 - Garanties</h5>
                            <p style={{ paddingLeft: "10px" }}>
                                1. Indien in de overeenkomst garanties zijn opgenomen, geldt het hiernavolgende. Verkoper garandeert dat het verkochte aan de overeenkomst beantwoordt, dat het zonder gebreken zal functioneren en dat het geschikt is voor het gebruik dat koper voornemens is ervan te maken. Deze garantie geldt voor een periode van twee kalenderjaren na ontvangst van het verkochte door koper.
                                <br />
                                2. De bedoelde garantie strekt ertoe om tussen verkoper en koper een zodanige risicoverdeling tot stand te brengen dat de gevolgen van een inbreuk op een garantie steeds volledig voor rekening en risico van verkoper komen en dat verkoper zich ter zake een inbreuk op een garantie nooit kan beroepen op artikel 6:75 BW. Het bepaalde in de vorige zin geldt ook als de inbreuk bij koper bekend was of bekend had kunnen zijn door het verrichten van onderzoek.
                                <br />
                                3. De genoemde garantie geldt niet wanneer het gebrek is ontstaan als gevolg van onoordeelkundig of oneigenlijk gebruik of wanneer - zonder toestemming - koper of derden wijzigingen hebben aangebracht dan wel geprobeerd hebben aan te brengen of het gekochte hebben gebruikt voor doeleinden waarvoor het niet bestemd is.
                                <br />
                                4. Indien de door verkoper verstrekte garantie betrekking heeft op een door een derde geproduceerde zaak is de garantie beperkt tot de garantie die door die producent wordt verstrekt.
                            </p>
                            <h5>Artikel 17 - Intellectueel eigendom</h5>
                            <p style={{ paddingLeft: "10px" }}>
                                1. UboTech behoudt alle intellectuele eigendomsrechten (waaronder auteursrecht, octrooirecht, merkenrecht, tekeningen- en modellen-recht, etc.) op alle producten, ontwerpen, tekeningen, geschriften, dragers met gegevens of andere informatie, offertes, afbeeldingen, schetsen, modellen, maquettes, etc., tenzij partijen schriftelijk anders zijn overeengekomen.
                                <br />
                                2. De klant mag genoemde intellectuele eigendomsrechten niet zonder voorafgaande schriftelijke toestemming van UboTech (laten) kopiëren, aan derden tonen en/of ter beschikking stellen of op andere wijze gebruiken.
                            </p>
                            <h5>Artikel 18 - Wijziging algemene voorwaarden</h5>
                            <p style={{ paddingLeft: "10px" }}>
                                1. UboTech is gerechtigd deze algemene voorwaarden te wijzigen of aan te vullen.
                                <br />
                                2. Wijzigingen van ondergeschikt belang kunnen te allen tijde worden doorgevoerd.
                                <br />
                                3. Grote inhoudelijke wijzigingen zal UboTech zoveel mogelijk vooraf met de klant bespreken.
                                <br />
                                4. Consumenten zijn gerechtigd bij een wezenlijke wijziging van de algemene voorwaarden de overeenkomst op te zeggen.
                            </p>
                            <h5>Artikel 19 - Toepasselijk recht en bevoegde rechter</h5>
                            <p style={{ paddingLeft: "10px" }}>
                                1. Op iedere overeenkomst tussen partijen is uitsluitend het Nederlands recht van toepassing.
                                <br />
                                2. De Nederlandse rechter in het arrondissement waar UboTech is gevestigd is exclusief bevoegd om kennis te nemen van eventuele geschillen tussen partijen, tenzij de wet dwingend anders voorschrijft.
                                <br />
                                3. De toepasselijkheid van het Weens Koopverdrag is uitgesloten.
                                <br />
                                4. Wanneer in een gerechtelijke procedure één of meerdere bepalingen van deze algemene voorwaarden als onredelijk bezwarend worden aangemerkt, dan blijven de overige bepalingen onverminderd van kracht.
                            </p>
                            <h5>Artikel 20 - Toeschrijving</h5>
                            <p>1. Deze algemene voorwaarden zijn gemaakt met behulp van Rocket Lawyer (https://www.rocketlawyer.com/nl/nl).</p>
                            <br />
                            Deze algemene voorwaarden zijn van tiepassing vanaf: 01 oktober 2022
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