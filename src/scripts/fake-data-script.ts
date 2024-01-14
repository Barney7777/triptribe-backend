import { NestFactory } from '@nestjs/core';
import { FakerService } from '@/faker/faker.service';
import { AppModule } from '@/app.module';

async function generateFakeData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const fakerService = app.get(FakerService);

  await fakerService.generateFakeData();

  await app.close();
}

generateFakeData();
