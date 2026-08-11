import type { NewsProviderName } from './news-provider-name'

export type NewsSource = {
  id: string
  name: string
  provider: NewsProviderName
}
