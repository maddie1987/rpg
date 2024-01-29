import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { MikroORM } from '@mikro-orm/core';

export default async (app: NestFastifyApplication) => {
  const orm = await app.get(MikroORM);
  const migrator = orm.getMigrator();
  if (await migrator.checkMigrationNeeded()) {
    await migrator.up();
  }
};
