import clientApi from '../../apiClient';
import urls from "../../api.urls";
function runTest() {
    clientApi.get(urls.batchUrl, {params: {ids: ["fileid1","fileid2"]}}).then(res=>{
        console.log(res.data);
    }).catch(e=> console.log(e));

    clientApi.get(urls.batchUrl, {params: {ids: ["fileid2"]}}).then(res=>{
        console.log(res.data);
    }).catch(e=> console.log(e));

    clientApi.get(urls.batchUrl, {params: {ids: ["fileid3"]}}).then(res=>{
        console.log(res.data);
    }).catch(e=> console.log(e));
}


export default runTest;