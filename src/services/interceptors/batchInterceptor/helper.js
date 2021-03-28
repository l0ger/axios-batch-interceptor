export const isBatchRequest= config => {
    return config.url.includes("file-batch-api")
};

export const convertIdsToArray = ids => {
    return typeof ids === 'string' ?  ids.split(','): ids;
}
/**
 * get missed files name array and generate error message string
 * @param missedFiles
 * @returns {string}
 */
export const getNotFoundFileRejectMessage = missedFiles => {
    const verb = missedFiles.length> 1 ? 'are' : 'is';
    return `${missedFiles.join(',')} ${verb} missing from the response`;
}

export const resolveBatchRequests = (response, queue) => {
    queue.forEach( req => {
        req.reject({req,response});
    })
}
/**
 * combines all requests params ids as the ids string
 * @param allRequests
 * @returns {string}
 */
export const combineRequestsParam = allRequests =>{
    let finalParams = [];
    allRequests.forEach(request => {
        finalParams = finalParams.concat(request.config.params.ids);
    });
    const temp = new Set(finalParams);
    return Array.from(temp).join(',');
}

export const generateFakeResponse = (config,data) =>{
    return {
        data: data,
        headers:{},
        config,
        status: 200,
        statusText: 'OK',
    }
}

/**
 * o(n)
 * It finds files related to this request from the batch data
 * @param request
 * @param batchData
 * @returns {{foundFiles: [], missedFiles: []}}
 */
export const getRequestResponse = (request,batchData) => {
    const requestedIds = request.config.params.ids;
    let batchDataDictionary = {};
    let missedFiles = [];
    let foundFiles = [];
    for(let i = 0; i < batchData.length; i++){
        batchDataDictionary[batchData[i].id] = batchData[i];
    }
    for(let j= 0; j < requestedIds.length; j++){
        const file = batchDataDictionary[requestedIds[j]];
        if(file){
            foundFiles.push(file);
        }else{
            missedFiles.push(requestedIds[j]);
        }
    }
    return {
        missedFiles,
        foundFiles,
    }
}
