import axios, { type AxiosInstance } from 'axios'

export function createAxiosInstance(options: { baseURL?: string; headers?: Record<string, string> } = {}): AxiosInstance {
  return axios.create({ baseURL: options.baseURL, headers: options.headers })
}
