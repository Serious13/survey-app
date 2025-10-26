import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { writeFile } from 'fs/promises'
import puppeteer, { Browser, Page } from 'puppeteer'

jest.mock('./app.service')

describe('AppController', () => {
  let appController: AppController
  const request = {"headers":{"Accept":"application/json","Content-Type":"application/json"},"body":"{\"selectedHouseType\":\"single\",\"selectedRoofDir\":[\"west\",\"east\",\"north\"],\"selectedRoofAge\":\"ageYoung\",\"selectedPowerId\":\"powerPhaseOne\",\"selectedSolutionType\":\"solutionAccepted\",\"firstName\":\"Anton\",\"secondName\":\"Mayer\",\"email\":\"a.mayer@gmail.com\",\"city\":\"Stuttgart\",\"street\":\"Stuttgarter\",\"building\":\"123\",\"postcode\":\"81922\",\"phoneNumber\":\"811-222-3902\"}","id":"0b7a43ec-7792-47c1-b4c5-e26dad6fecc0"}
  let surveryId : string = "0b49d01261bb66904499578725593964a84d6147"
  let id : string = "1f0aec3d-401d-6130-9a39-103c31e713b1"

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController)
   
  })

  it('check if assets are validated with function validateOrderFields', () => {
    const result = true
    const validateOrderFieldsSpy = jest.spyOn(AppService.prototype, 'validateOrderFields').mockReturnValue(result)
    const appService = new AppService()
    expect(appService.validateOrderFields(JSON.stringify(request))).toBe(result)
  })

  it('POST - checks if file was created', async () => {
    const appService = new AppService()
    let message : string
    let status : any
    (appService.postSurvey as jest.Mock).mockResolvedValue({ status: 200, message: "File was created" })
    const response : {[key:string] : string | any} = await appService.postSurvey(request)
    message = response?.message ? response.message : ""
    status = response?.status ? response.status : ""
    expect(status).toBe(200)
    expect(message).toBe('File was created')
  })

  it('GET - checks if survey was fetched', async () => {
    const appService = new AppService()
    let message : string
    let status : any
    (appService.getSurvey as jest.Mock).mockResolvedValue({ status: 200, message: "Survey was found" })
    const response : {[key:string] : string | any} = await appService.getSurvey(surveryId)
    message = response?.message ? response.message : ""
    status = response?.status ? response.status : ""
    expect(status).toBe(200)
    expect(message).toBe('Survey was found')
  })

  it('GET - checks if all surveys were fetched', async () => {
    const appService = new AppService()
    let message : string
    let status : any
    (appService.getSurveys as jest.Mock).mockResolvedValue({ status: 200, message: "Surveys were found" })
    const response : {[key:string] : string | any} = await appService.getSurveys()
    message = response?.message ? response.message : ""
    status = response?.status ? response.status : ""
    expect(status).toBe(200)
    expect(message).toBe("Surveys were found")
  })

  it('DELETE - checks if survey with id was deleted', async () => {
    const appService = new AppService()
    let message : string
    let status : any
    (appService.deleteSurvey as jest.Mock).mockResolvedValue({ status: 200, message: "Survey with id was deleted" })
    const response : {[key:string] : string | any} = await appService.deleteSurvey(id)
    message = response?.message ? response.message : ""
    status = response?.status ? response.status : ""
    expect(status).toBe(200)
    expect(message).toBe("Survey with id was deleted")
  })

  it('e2e test', async () => {
    const appService = new AppService()
    const browser: Browser = await puppeteer.launch();
    const page: Page = await browser.newPage();
    let message : string
    let status : any
    const input = { name: 'test', email: 'test@test.com', password: '12345678' };

    await page.goto('http://localhost:3001');
    await page.click('button[type="submit"]');

    const response : {[key:string] : string | any} = await appService.postSurvey(request);
    message = response?.message ? response.message : ""
    status = response?.status ? response.status : ""
    expect(status).toBe(200)
    expect(message).toBe('File was created')
    await browser.close();
  })
})