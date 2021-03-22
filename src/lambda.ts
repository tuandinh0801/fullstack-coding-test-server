/* eslint-disable @typescript-eslint/no-var-requires */
import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as serverless from 'aws-serverless-express';
import { proxy } from 'aws-serverless-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

let cachedServer: Server;

process.on('unhandledRejection', (reason) => {
  // tslint:disable-next-line:no-console
  console.error(reason);
});

process.on('uncaughtException', (reason) => {
  // tslint:disable-next-line:no-console
  console.error(reason);
});

function bootstrapServer(): Promise<Server> {
  const expressApp = require('express')();
  const adapter = new ExpressAdapter(expressApp);
  return NestFactory.create(AppModule, adapter, { logger: false })
    .then((app) => {
      const config = new DocumentBuilder()
        .setTitle('Fullstack Coding Test')
        .setVersion('1.0')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document);

      app.enableCors({
        origin: '*',
        methods: '*',
        allowedHeaders: '*',
      });
      app.init();
    })
    .then(() => serverless.createServer(expressApp));
}

export const handler: Handler = async (event: any, context: Context) => {
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
