import axios from "axios";
import addInterceptors from "./interceptors/index";
import apiConfig from './api.configs';
export const createClient = ()=>{
    const instance = axios.create(apiConfig);
    addInterceptors(instance);
    return instance;
}

const client = createClient();
export default client;