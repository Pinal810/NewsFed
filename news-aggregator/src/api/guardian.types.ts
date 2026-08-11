export type GuardianResult = {
  id: string
  type: string
  sectionId?: string
  sectionName?: string
  webPublicationDate?: string
  webTitle: string
  webUrl: string
  fields?: {
    headline?: string
    byline?: string
    thumbnail?: string
    body?: string
  }
}

export type GuardianResponse = {
  response: {
    status: string
    total: number
    startIndex?: number
    page?: number
    pageSize?: number
    results: GuardianResult[]
  }
}
