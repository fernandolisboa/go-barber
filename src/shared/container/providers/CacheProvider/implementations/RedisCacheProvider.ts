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
    const cachedData = await this.client.get(key)

    if (!cachedData) {
      return null
    }

    const data = JSON.parse(cachedData) as T

    return data
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key)
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`)

    const pipeline = this.client.pipeline()

    keys.forEach(key => pipeline.del(key))

    await pipeline.exec()
  }
}

export default RedisCacheProvider
