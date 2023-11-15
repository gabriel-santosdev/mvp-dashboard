import axios from 'axios'
import AuthService from './auth'

const API_ENVS = {
  production: '',
  development: '',
  local: 'http://localhost:3000'
}

const httpClient = axios.create({
  baseURL: API_ENVS.local
})

// função para disparar somente erros no try/catch quando for erros que ja esperamos ex: 400/401 quando for feita uma requisição
httpClient.interceptors.response.use((response) => response, (error) => {
  const canThrowError = error.request.status === 0 ||
        error.request.status === 500
  if (canThrowError) {
    throw new Error(error.message)
  }
  return error
})

export default {
  auth: AuthService(httpClient)
}
