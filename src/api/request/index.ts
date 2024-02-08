export default function request(url: string, option: RequestInit = {}) {
  return fetch(url, option)
}