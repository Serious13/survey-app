import { useId, FormEvent } from 'react'
import axios from 'axios'
import './App.css';

const headers : {[key:string] : string} = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}
const BASE_URL = process.env?.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "http://localhost:3000"

async function handleSubmit(e : any) : Promise<any> {
    try{
        e.preventDefault();
        const form = e.currentTarget;
        console.log("target", e, form, e.currentTarget.elements,"currentTarget", new FormData(e.currentTarget))       
        let formData : {[key:string] : string | any} = new FormData(form);
        let resData : {[key:string] : string | any} = {}
        for (let [key,value] of formData.entries()) {
            if (key === "selectedRoofDir") {
                 if (formData.getAll("selectedRoofDir").length > 1) {
                    console.log("LOOKS", formData.getAll("selectedRoofDir"))
                    value = [...formData.getAll("selectedRoofDir")]
                    resData[key] = [...formData.getAll("selectedRoofDir")]
                }
            }
            else resData[key] = value
        }
        console.log([...formData.entries()]);
        console.log("BASE_URL",BASE_URL)
        let res = await axios.post(`${BASE_URL}/api/survey/submit`, { headers: headers, body: JSON.stringify(resData) })
        console.log("res", res)
        return res
    }
    catch(e) {
        console.error(e)
        return e
    }
}

async function getSurveys(e : any): Promise<any> {
    try{ 
        console.log("handleGet")
        e.preventDefault();
        const applications = await axios.get(`${BASE_URL}/api/survey`, { headers: headers} )
        console.log("applications", applications)
        return applications
    }
    catch(e) {
        console.error(e)
        return e
    }
}

async function getSurveyById(e : any): Promise<any> {
    try {
        console.log("getSurveyById")
        e.preventDefault();
        let id : string = "1f0aec3d-401d-6130-9a39-103c31e713b1"
        const survey = await axios.get(`${BASE_URL}/api/survey/${id}`, { headers: headers} )
        console.log("GOT survey", survey)
        return survey
    }
    catch(e) {
        console.error(e)
        return e
    }
}

async function deleteSurveyById(e : any): Promise<any> {
    try {
        console.log("deleteSurveyById")
        e.preventDefault();
        let id : string = "1f0aec3d-401d-6130-9a39-103c31e713b1"
        const survey = await axios.delete(`${BASE_URL}/api/survey/${id}`, { headers: headers} )
        console.log("deleted survey", survey)
        return survey
    }
    catch(e) {
        console.error(e)
        return e
    }
}

export default function Page() {
    const [houseTypeId, roofAgeId, roofDirectionId, powerId, energySolutionId] = useId();
    return (
        <body>
            <form onSubmit={handleSubmit} method="post">
                <h1>Lohnt sich eine Solaranlage für Ihr Dach?</h1>
                <div className="survey">
                    <div className="houseType">
                        <label htmlFor={houseTypeId}>
                            Welche Art von Immobilie besitzen Sie?  
                        </label>
                        <select id={houseTypeId} name="selectedHouseType">
                            <option value="single">Einfamilienhaus</option>
                            <option value="multiple">Mehrfamilienhaus</option>
                            <option value="commercial">Gewerbeimmobilie</option>
                        </select>
                    </div>
                    <div className="roof">
                        <label htmlFor={roofDirectionId}>
                            Wie ist Ihr Dach ausgerichtet?  
                        </label>
                        <select id={roofDirectionId} name="selectedRoofDir" multiple={true}>
                            <option value="south">Süd</option>
                            <option value="west">West</option>
                            <option value="east">Ost</option>
                            <option value="north">Nord</option> 
                            <option value="noDir">Keine Angabe</option>
                        </select>
                    </div>
                    <div className="roofAge">
                        <label htmlFor={roofAgeId}>
                            Wie alt ist Ihr Dach?  
                        </label>
                        <select id={roofAgeId} name="selectedRoofAge">
                            <option value="ageYoung">Unter 5 Jahre</option>
                            <option value="ageMiddle">5–15 Jahre</option>
                            <option value="ageOld">Über 15 Jahre</option>
                            <option value="noAge">Keine Angabe</option>
                        </select>
                    </div>
                    <div className="power">
                        <label htmlFor={powerId}>
                            Wie hoch ist Ihr Stromverbrauch pro Jahr? 
                        </label>
                        <select id={powerId} name="selectedPowerId">
                            <option value="powerPhaseOne">Unter 3.000 kWh</option>
                            <option value="powerPhaseMiddle">3.000–5.000 kWh</option>
                            <option value="powerPhaseOld">Über 5.000 kWh</option>
                            <option value="powerPhaseNone">Keine Angabe</option> 
                        </select>
                    </div>
                    <div className="energySolution">
                        <label htmlFor={energySolutionId}>
                            Sind Sie auch an weiteren Energielösungen interessiert?  
                        </label>
                        <select id={energySolutionId} name="selectedSolutionType">
                            <option value="solutionAccepted">Ja</option>
                            <option value="solutionNotAccepted">Nein</option>
                            <option value="solutionNone">Weis nicht</option>
                        </select>
                    </div>
                </div>
                <div className = "clientBar">
                    <h1>Kontakt</h1>          
                    <div className="clientBarInfo">
                        <label htmlFor = "firstName">Vorname</label>
                        <input type="text" name="firstName" className="firstName" id="firstName" minLength={4} maxLength={8} pattern="^[A-Za-z]+$" title="Only letters are allowed" defaultValue='Anton' required/>
                    </div>
                    <div className="clientBarInfo">
                        <label htmlFor = "secondName">Name</label>
                        <input type="text" name="secondName" className="secondName" minLength={4} maxLength={8} pattern="^[A-Za-z]+$" title="Only letters are allowed" defaultValue='Mayer' required/>
                    </div>
                    <div className="clientBarInfo">
                        <label htmlFor = "email">Email</label>
                        <input type="email" name="email" className="email" minLength={4} maxLength={20} pattern=".+@gmail\.com" title="Use @ .com" defaultValue='a.mayer@gmail.com' required/>
                    </div>
                    <div className="clientBarInfo">
                        <label htmlFor = "city">Stadt</label>
                        <input type="text" name="city" className="city" minLength={4} maxLength={8} pattern="^[A-Za-z]+$" title="Only letters are allowed" defaultValue='Stuttgart' required/>
                    </div>
                </div>
                <button type="submit" className="buttonSubmit" id="submitForm" >Abschicken</button>
            </form>
        </body>
    )
}
