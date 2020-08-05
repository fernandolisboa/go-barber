import IORedis, { Redis } from 'ioredis'

import cacheConfig from '@config/cache'

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

class RedisCacheProvider implements ICacheProvider {
  private client: Redis

  constructor() {
    this.client = new IORedis(cacheConfig.config.redis)
  }

  public async save<T>(key: string, value: T): Promise<void> {
    await this.client.set(key, JSON.stringify(value))
  }

  public async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key)

    return data ? JSON.parse(data) : null
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key)
  }
}

export default RedisCacheProvider
