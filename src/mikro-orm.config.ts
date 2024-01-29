import { defineConfig, Options } from '@mikro-orm/mariadb';
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';

export default defineConfig({
  entities: ['./**/*.entity.js', './**/*.entities.js'],
  entitiesTs: ['./**/*.entity.ts', './**/*.entities.ts'],
  forceUtcTimezone: true,
  dbName: 'rpg',
  host: 'localhost',
  port: 3308,
  user: 'rpg_user',
  password: 'rpg_pwd',
  pool: {
    min: 0,
    max: 15,
    acquireTimeoutMillis: 60 * 1000,
    idleTimeoutMillis: 30 * 1000,
  },
  migrations: {
    tableName: 'rpg_migrations',
    path: './dist/database/migration/migrations',
    pathTs: './src/database/migration/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: false,
    disableForeignKeys: true,
    allOrNothing: true,
    dropTables: false,
    safe: false,
    snapshot: false,
    emit: 'ts',
    generator: TSMigrationGenerator,
  },
  extensions: [Migrator],
}) as Options;
