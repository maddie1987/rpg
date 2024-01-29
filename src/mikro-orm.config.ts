import { defineConfig, Options } from "@mikro-orm/mariadb";
import { TSMigrationGenerator } from "@mikro-orm/migrations";

export default defineConfig({
  entities: ['./**/*.entity.js', './**/*.entities.js'],
  entitiesTs: ['./**/*.entity.ts', './**/*.entities.ts'],
  forceUtcTimezone: true,
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  pool: {
    min: 0,
    max: 15,
    acquireTimeoutMillis: 60 * 1000,
    idleTimeoutMillis: 30 * 1000,
  },
  migrations: {
    tableName: 'sim_migrations',
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
    generator: TSMigrationGenerator
  }
}) as Options;