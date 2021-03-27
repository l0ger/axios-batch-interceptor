import urls from "../../api.urls";
import { batchInterceptorQueueAge } from "../../api.configs";
import {
    isBatchRequest,
    getNotFoundFileRejectMessage,
    resolveBatchRequests,
    combineRequestsParam,
    getRequestResponse,
    generateFakeResponse,
    convertIdsToArray,
} from "./helper";

let batchTimerQueueActive = false;
let batchRequests = [];

export const requestBatchUse = (config, instance) => {
    if (!isBatchRequest(config) || config.realBatchRequest) return config;
    if (!batchTimerQueueActive) {
        batchTimerQueueActive = true;
        batchRequests = [];
        config.params.ids = convertIdsToArray(config.params.ids);// we need array of ids in future calculation
        setTimeout(async () => {
            batchTimerQueueActive = false;
            const queue = [...batchRequests];
            batchRequests = [];
            const response = await instance.get(urls.batchUrl, {
                params: {ids: combineRequestsParam(queue)},
                realBatchRequest: true
            });
            response.config.queue = queue;
            resolveBatchRequests(response, queue);
        }, batchInterceptorQueueAge);
    }
    if (batchTimerQueueActive) {
        return new Promise((resolve, reject) => {
            batchRequests.push({resolve, reject, ids: config.params.ids, config: config})
        });
    }
}

const batchInterceptor = (instance) => {
    instance.interceptors.request.use(config => requestBatchUse(config, instance), error => {
        Promise.reject(error);
    });
    instance.interceptors.response.use(response => response, error => {
        const {response, req} = error;
        if (response && isBatchRequest(response.config)) {
            const requestRealResponse = getRequestResponse(req, response.data.items);
            if (requestRealResponse.missedFiles.length) {
                return Promise.reject(getNotFoundFileRejectMessage(requestRealResponse.missedFiles));
            }
            const fakeResponse = generateFakeResponse(req.config, requestRealResponse.foundFiles)
            return Promise.resolve(fakeResponse);
        }
        return Promise.reject(error);
    });
}

export default batchInterceptor;