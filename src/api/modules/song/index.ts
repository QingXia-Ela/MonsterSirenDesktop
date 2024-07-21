import request from '@/api/request';

const HOST = 'http://localhost';
const API_PROXY = 11452;

export function getSong(cid: string) {
  return request(`${HOST}:${API_PROXY}/song/${cid}`);
}