import axios from 'axios'

// Create an instance of axios, once per request
const service = axios.create({
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  timeout: 10 * 1000,
  validateStatus: status => status >= 200 && status <= 500
})

service.interceptors.response.use(res => {
  return res.data
}, error => {
  return Promise.reject(new Error(error))
})

export default service
