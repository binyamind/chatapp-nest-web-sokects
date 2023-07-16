import { DynamicModule, FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { Module } from '@nestjs/common';
import IORedis, { Redis, RedisOptions } from 'ioredis';

// module identifier
export const IO_REDIS = 'IO_REDIS';

type RedisModuleOptions = {
  connentionsConfigiration: RedisOptions;
  onClientReady?: (client: Redis) => void;
};

type RedisAsyncModuleOptions = {
  useAFactory: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;
} & Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'inject'>;

@Module({})
export class RedisModule {
  static async registerRedisModule({
    useAFactory,
    imports,
    inject,
  }: RedisAsyncModuleOptions): Promise<DynamicModule> {
    const redisProvider = {
      provide: IO_REDIS,
      useFactory: async (...args) => {
        const { connentionsConfigiration, onClientReady } = await useAFactory(
          ...args,
        );

        const clinet = await new IORedis(connentionsConfigiration);
        onClientReady(clinet);
        return clinet;
      },
      inject,
    };
    return {
      module: RedisModule,
      imports,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}
