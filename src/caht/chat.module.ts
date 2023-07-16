import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatController } from './chat.controller';
import { RedisModule } from './chat.redis.module';
import { ChatRepository } from './chat.repository';
import { ChatService } from './chat.service';
import { CLIENT_REPOSITORY } from './dtos/types/constants';

export const redisModule = RedisModule.registerRedisModule({
  imports: [ConfigModule],
  useAFactory: async (configService: ConfigService) => {
    const logger = new Logger('RedisModule');

    return {
      connentionsConfigiration: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      },
      onClientReady: (client) => {
        client.on('error', (err) => {
          logger.error('Redis Client Error: ', err);
        });

        client.on('connect', () => {
          logger.log(
            `Connected to redis on ${client.options.host}:${client.options.port}`,
          );
        });
      },
    };
  },
  inject: [ConfigService],
});

@Module({
  imports: [ConfigModule, redisModule],
  providers: [
    ChatService,
    {
      provide: CLIENT_REPOSITORY,
      useClass: ChatRepository,
    },
  ],
  controllers: [ChatController],
})
export class ChatModule {}
