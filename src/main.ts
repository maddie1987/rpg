import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { initSwagger } from './shared/env.provider';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import migrateDB from './database/migration/migrate-database.provider';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  if (initSwagger()) {
    console.log('Initialize Swagger...');
    const version = process.env.npm_package_version!;
    const config = new DocumentBuilder()
      .setTitle('RPG API')
      .setDescription('API for creative writing and character arc building.')
      .setVersion(version)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await migrateDB(app);

  app.enableShutdownHooks();
  app.enableCors({ origin: '*' });

  await app.listen(3000);
}
bootstrap();
