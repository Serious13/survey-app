import { Injectable } from '@nestjs/common';
import { writeFile } from 'node:fs/promises';
import * as fs from 'fs'

@Injectable()
export class AppService {
  //validates order fields and returns true if all fields are validated
  validateOrderFields(data : string) : boolean {
    let validated : boolean = true
    const numbers = /^(\d+\s?)+$/ //validates digits
    const letters = /^[A-Za-z]+$/ //validates letters
    data = JSON.parse(data)
    for (let [key,value] of Object.entries(data)) {
      if (["selectedHouseType","selectedRoofDir","selectedRoofAge","selectedPowerId","selectedSolutionType"].includes(key)) {
        value !== "" ? validated = true : validated = false
      }
      else {     
        if (key === "house" || key === "postcode" || key === "building") {          
          if ((!value || !(parseInt(value) > -1) || !numbers.test(value))) {     
            validated = false 
          }          
        }
        else {
          if (!(["email", "phoneNumber"].includes(key))) { 
            if ((!value || !(letters.test(value)))) {           
              validated = false 
            }               
          }
        }
      }      
    }
    console.log("validated", validated)
    return validated
  }

  getId() {    
    const crypto = require('crypto')
    return crypto.randomBytes(20).toString('hex')  
  }

  async postSurvey(data : {[key:string] : string | any}) : Promise<object> {
    try {
      console.log("survey", data)
      let surveyId : string = ""
      let body = data?.body ? data.body : {}
      if (this.validateOrderFields(body)) {
        surveyId = this.getId()
        console.log("surveyId", surveyId)
        data["id"] = surveyId
        await writeFile(`./surveys/${surveyId}.json`, JSON.stringify(data), 'utf8')
        return { status: 201, message: 'File was created' }
      }
      else return { status: 400, message: 'Validation failed' }
   
    }
    catch(e) {
      console.log(e)
      return e
    }
    finally {
    }
  }
 
  getFileNames() {
    const surveyIds: string[] = fs.readdirSync('./surveys')
                                  .filter((fileName: string) => fs.statSync(`./surveys/${fileName}`).isFile())
                                  .map((fileName:string) => fileName.split(".")[0])
    return surveyIds
  }

  async getSurveys() : Promise<any>{
    try {
      let data : Object = {}
      let dataJson : string = ""
      let applicationIds : Array<string> = []
      let surveys : Array<string> = []
      applicationIds = this.getFileNames()
      console.log("ids", applicationIds)
      for (let id of applicationIds) {
        data = fs.readFileSync(`./surveys/${id}.json`,  { encoding: 'utf8', flag: 'r' })
        dataJson = JSON.stringify(data)
        surveys.push(dataJson)
      }
      console.log("DATA", surveys)    
      return { status: 200, data: JSON.stringify(surveys), message: "Surveys were found" }
    }
    catch(e) {
      console.log(e)
      return e
    }
    finally {
    }
  }


  async getSurvey(id : string) : Promise<object>{
    try {
      const data = fs.readFileSync(`./surveys/${id}.json`,  { encoding: 'utf8', flag: 'r' })
      console.log("getSurvey", data)
      return { status: 200, data: JSON.stringify(data), message: "Survey was found" }
    }
    catch(e) {
      console.log(e)
      return e
    }
    finally {

    }   
  }

  async deleteSurvey(id : string): Promise<any> {
    try {
      fs.promises.unlink(`./surveys/${id}.json`)
      return { status: 200, message: "Survey with id was deleted" }
    }
    catch(e) {
      console.log(e)
      return e
    }
    finally {

    }       
  }
}
