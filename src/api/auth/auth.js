import request from '@/utils/request'

// 获取token
export function getAccesToken(code) {
  return request({
    url: '/auth/accessToken?code='+ code,
    method: 'get',
  })
}
