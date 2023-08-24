import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'postgres',
  port: parseInt(process.env.DB_PRIMARY_PORT),
  username: 'janny',
  password: 'Aj189628@',
  database: 'ali-exchange-auth-service',
  entities: [],
  synchronize: true,
  autoLoadEntities: true,
  logging: true,
  logger: 'file',
};
