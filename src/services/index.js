import axios from 'axios'
import router from '@/router'
import AuthService from './auth'

const API_ENVS = {
  production: 'https://backend-treinamento-vue3.vercel.app',
  development: '',
  local: 'http://localhost:3000'
}

const httpClient = axios.create({
  baseURL: API_ENVS.local
})

// Função para verificar se o token existe ao fazer uma requisição
httpClient.interceptors.request.use(config => {
  const token = window.localStorage.getItem('token')

  if (token) {
    config.headers.common.Authorization = `Bearer ${token}`
  }

  return config
})

// função para disparar somente erros no try/catch quando for erros que ja esperamos ex: 400/401 quando for feita uma requisição
httpClient.interceptors.response.use((response) => response, (error) => {
  const canThrowError = error.request.status === 0 || error.request.status === 500
  if (canThrowError) {
    throw new Error(error.message)
  }
  // se o token for inválido será direcionado novamente para Home ao tentar rendarizar uma tela que precisa
  // de um usuário logado e não estiver mais logado ou não consegiu logar
  if (error.response.status === 401) {
    router.push({ name: 'Home' })
  }
  return error
})

export default {
  auth: AuthService(httpClient)
}
