import axios from 'axios'
import {TOKEN} from "@/constants";

axios.defaults.baseURL = 'https://site.ontopo.work' // This should be inside .env file

axios.interceptors.request.use((config) => {
    const token: string | null = localStorage.getItem(TOKEN)
    if (token) config.headers.token = token
    return config
})

axios.interceptors.response.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default axios