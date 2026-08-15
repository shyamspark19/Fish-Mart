import api from './api'

export async function register(data: { name: string; email: string; password: string }) {
  const res = await api.post('/auth/register', data)
  return res.data
}

export async function login(data: { email: string; password: string }) {
  const res = await api.post('/auth/login', data)
  return res.data
}

export async function me(token?: string) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  const res = await api.get('/auth/me')
  return res.data
}
