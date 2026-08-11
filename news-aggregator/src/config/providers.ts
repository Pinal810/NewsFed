import type { NewsProviderName } from '../types/news-provider-name'

export const AVAILABLE_PROVIDERS: NewsProviderName[] = ['newsapi', 'theguardian', 'nyt']

export type ProviderConfig = {
  name: NewsProviderName
  // placeholder for future keys (baseUrl, apiKey env var name, etc.)
  baseUrl?: string
}

export const PROVIDER_CONFIGS: ProviderConfig[] = AVAILABLE_PROVIDERS.map((name) => ({ name }))
