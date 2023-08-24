import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { Permission } from './entities/permission.entity';
import { EntityManager, Repository } from 'typeorm';

let permissionRepo: Repository<Permission>;

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq-service:5672'],
      queue: 'auth_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.setGlobalPrefix('api/v1/auth-service');
  await app.startAllMicroservices();
  await app.listen(process.env.PORT);

  const entityManager: EntityManager = app.get(EntityManager);
  permissionRepo = entityManager.getRepository(Permission);
  extractRoutes(server);
}
bootstrap();

function extractRoutes(server: express.Express) {
  server._router.stack.forEach(printRoute);
}

async function printRoute(layer: any) {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods)
      .map((method) => method.toUpperCase())
      .join(', ');
    const path = layer.route.path;

    const name = getnameFroumRoutes(path, methods);

    // Check for existing permission with the same name and path
    const existingPermission = await permissionRepo.findOne({
      where: { name: name, path: path },
    });
    if (existingPermission) {
      return;
    }
    saveSermission(name, path);
  }
}
function saveSermission(name: string, path: any) {
  const permission = new Permission();
  permission.name = name;
  permission.path = path;
  permission.guard = 'web';
  permission.created_at = new Date();
  permissionRepo.save(permission);
}

function getnameFroumRoutes(path: string, method: string) {
  method = getMethodName(path, method);
  const name = path;
  path =
    method.toLowerCase() +
    '-' +
    path
      .replaceAll('/api/v1/auth-service/', '')
      .replaceAll('/', '-')
      .replace('-:id', '');

  if (path.includes('login')) {
    path = 'login';
  }
  if (path.includes('logout')) {
    path = 'logout';
  }
  if (path.includes('register')) {
    path = 'register';
  }
  if (path.includes('forgot-password')) {
    path = 'forgot-password';
  }
  if (path.includes('reset-password')) {
    path = 'reset-password';
  }
  if (path.includes('verify-email')) {
    path = 'verify-email';
  }
  if (
    path.includes('approval') ||
    path.includes('reject') ||
    path.includes('approve') ||
    path.includes('approved') ||
    path.includes('cancel') ||
    path.includes('cancelled') ||
    path.includes('rejected') ||
    path.includes('confirmed') ||
    path.includes('confirm')
  ) {
    path = name
      .replaceAll('/api/v1/auth-service/', '')
      .replaceAll('/', '-')
      .replace('-:id', '');
  }
  return path;
}
function getMethodName(path: string, method: string): string {
  switch (method) {
    case 'GET':
      if (path.slice(-3) == ':id') {
        method = 'view';
      } else {
        method = 'view-all';
      }
      break;
    case 'POST':
      method = 'create';
      break;
    case 'PATCH':
      method = 'update';
      break;
    case 'PUT':
      method = 'update';
      break;
    case 'DELETE':
      method = 'delete';
      break;

    default:
      method = 'view-all';
      break;
  }
  return method;
}
