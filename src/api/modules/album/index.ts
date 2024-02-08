import request from '@/api/request';

const API_PROXY = 11452;

export function getAlbumDetail(id: string) {
  return request(`localhost:${API_PROXY}/album/${id}/detail`);
}

export function getAlbumData(id: string) {
  return request(`localhost:${API_PROXY}/album/${id}/data`);
}
