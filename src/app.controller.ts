import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Injectable } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
