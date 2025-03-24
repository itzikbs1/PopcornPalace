import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [DatabaseService, ConfigService],
    }).compile();

    databaseService = module.get<DatabaseService>(DatabaseService);
    await databaseService.onModuleInit();
  });

  afterAll(async () => {
    await databaseService.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(databaseService).toBeDefined();
  });

  it('should connect to the test database', async () => {
    const result = await databaseService.$queryRaw`SELECT 1`;
    expect(result).toBeDefined();
  });
});
