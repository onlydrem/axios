import axios from "axios"
import { message } from "antd"
import { getToken, removeToken } from "./token"

// 创建axios实例
const service = axios.create({
  baseURL:
    process.env.NODE_ENV == "development" ? "/" : "/", // api的base_url */,
  timeout: 15000, // 请求超时时间
  withCredentials: false
})

// request拦截器
service.interceptors.request.use(
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

service.interceptors.response.use(
  response => {
    const res = response.data
    if (
      res.code === 0 ||
      (response.config && response.config.responseType === "blob")
    ) {
      return response.data
    } else {
      // message.error('操作失败');
      return Promise.reject(res).catch(e => { })
    }
    // return response;
  },
  error => {
    if (error.response.status === 401) {
      message.warning("您的登陆已过期，请重新登陆")

      setTimeout(() => (window.location.href = "#/login"), 1000)
      removeToken()
    }
    return Promise.reject(error).catch(e => { })
  }
)

export default service
