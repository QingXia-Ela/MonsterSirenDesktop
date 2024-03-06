import request from '@/api/request';

const HOST = 'http://localhost';
const API_PROXY = 11452;

export function getAlbums() {
  return request(`${HOST}:${API_PROXY}/albums`);
}

export function getAlbumDetail(id: string) {
  return request(`${HOST}:${API_PROXY}/album/${id}/detail`);
}

export function getAlbumData(id: string) {
  return request(`${HOST}:${API_PROXY}/album/${id}/data`);
}
