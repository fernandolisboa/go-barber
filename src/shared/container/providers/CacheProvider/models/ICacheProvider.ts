interface ICacheProvider {
  save<T>(key: string, value: T): Promise<void>
  get<T>(key: string): Promise<T | null>
  invalidate(key: string): Promise<void>
  invalidatePrefix(prefix: string): Promise<void>
}

export default ICacheProvider
