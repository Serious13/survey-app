import { Controller, Delete, Get, Post, Req, Body, Param, Res  } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/api/survey/:id')
  getSurvey(@Param() params: any): Object {    
    return this.appService.getSurvey(params.id);
  }
  @Get('/api/survey/')
  getSurveys() : Object {
    return this.appService.getSurveys();
  }
  @Delete('api/survey/:id')
  deleteSurvey(@Param() params: any) {
    return this.appService.deleteSurvey(params.id);
  }
  @Post('api/survey/submit')
  async postSurvey(@Body() req: any) {
    console.log('body:', req);
    return this.appService.postSurvey(req);
  }
}
