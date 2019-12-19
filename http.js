
import axios from "axios"
import { message } from "antd"
import { getToken, setToken, removeToken } from "./token"
import { isNotEmpty } from "@/utils/string"

const fetch = axios.create({
  baseURL:
    process.env.NODE_ENV == "development" ? "/" : "/", // api的base_url
  timeout: 15000, // 请求超时时间
  withCredentials: false
})

fetch.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers["token"] = token
    }
    return config
  },
  error => {
    Promise.reject(error).catch(e => { })
  }
)

fetch.interceptors.response.use(
  response => {
    const res = response.data
    let token = response.headers["token"]
    if (isNotEmpty(token)) {
      setToken(token)
    }
    if (res.code === 0) {
      if (res.result) {
        return res.result
      } else {
        return res
      }
    } else {
      return Promise.reject(res)
    }
  },
  error => {
    if (error.response.status === 401) {
      setTimeout(() => (window.location.href = "#/login"), 1000)
      message.warning("您的登陆已过期，请重新登陆")
      removeToken()
    }
    return Promise.reject(error)
  }
)

const get = (url, params = {}) => {
  return new Promise(resolve => {
    fetch
      .get(url, { params: params })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        message.error(err.message)
      })
  })
}

const post = (url, params = {}) => {
  return new Promise(resolve => {
    fetch
      .post(url, params)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        message.error(err.message)
      })
  })
}
const del = (url, params = {}) => {
  return new Promise(resolve => {
    fetch
      .delete(url, { params: params })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        message.error(err.message)
      })
  })
}

const put = (url, params = {}) => {
  return new Promise(resolve => {
    fetch
      .put(url, params)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        message.error(err.message)
      })
  })
}

export { fetch, get, post, del, put }
