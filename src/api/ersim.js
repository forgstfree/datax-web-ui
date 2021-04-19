import request from '@/utils/request'

export function fetchGojsData(query) {
  return request({
    baseURL: process.env.VUE_APP_BASE_URL,
    url: '/ersimilar/fetchData/',
    method: 'GET',
    params: query
  })
}

export function createGojsData(data) {
  return request({
    baseURL: process.env.VUE_APP_BASE_URL,
    url: '/ersimilar/createData/',
    method: 'post',
    data
  })
}

export function updateGojsData(data) {
  return request({
    baseURL: process.env.VUE_APP_BASE_URL,
    url: '/ersimilar/updateData/',
    method: 'POST',
    data
  })
}
