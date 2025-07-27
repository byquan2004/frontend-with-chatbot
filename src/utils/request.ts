import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

class Request {
  private instance: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)

    // Request Interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // You can add logic here before the request is sent, e.g., adding an auth token
        // const token = localStorage.getItem('token')
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`
        // }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // You can process the response data here
        // For example, directly return response.data
        if (response.status === 200) {
          return response.data
        } else {
          // Handle other successful status codes if needed
          return response
        }
      },
      (error) => {
        // Handle global errors here
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response Error:', error.response.data)
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request Error:', error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error:', error.message)
        }
        return Promise.reject(error)
      }
    )
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }

  public post<T = any>(url:string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }
}

const request = new Request({
  baseURL: '/api', // Use the Vite proxy
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

export default request