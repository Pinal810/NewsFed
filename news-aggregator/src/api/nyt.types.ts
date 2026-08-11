export type NytDoc = {
  _id: string
  web_url: string
  snippet?: string
  lead_paragraph?: string
  abstract?: string
  print_page?: number
  source?: string
  pub_date?: string
  byline?: { original?: string }
  headline?: { main?: string }
  multimedia?: Array<{ url?: string; subtype?: string }>
}

export type NytResponse = {
  status: string
  response: {
    docs: NytDoc[]
    meta?: { hits?: number; offset?: number; time?: number }
  }
}
