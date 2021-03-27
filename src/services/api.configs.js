import urls from "./api.urls";
const apiConfig = {
    host: urls.baseURL,
    baseAPI: urls.baseURL,
    baseURL:urls.baseURL,
    headers: {}
};

//millisecond
export const batchInterceptorQueueAge = 1000 ;

export default apiConfig;