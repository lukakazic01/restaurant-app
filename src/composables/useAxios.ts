import {inject} from "vue";
import type {AxiosInstance} from "axios";
import axios from "axios";
export const useAxios = (): AxiosInstance => {
    const axiosPlugin = inject<AxiosInstance>('axios');
    if (!axiosPlugin) return axios;
    return axiosPlugin;
};