import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface ICacheData {
  [key: string]: unknown
}

class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheData

  constructor() {
    this.cache = {}
  }

  public async save<T>(key: string, value: T): Promise<void> {
    this.cache[key] = value
  }

  public async get<T>(key: string): Promise<T | null> {
    const cachedData = this.cache[key]

    if (!cachedData) {
      return null
    }

    return cachedData as T
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key]
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`),
    )

    keys.forEach(key => delete this.cache[key])
  }
}

export default FakeCacheProvider
