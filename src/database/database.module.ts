import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    DatabaseService,
    {
      provide: DatabaseService,
      useFactory: (configService: ConfigService) => {
        return new DatabaseService(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
