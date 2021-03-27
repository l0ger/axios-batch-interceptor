import batchInterceptor from "./batchInterceptor/batchInterceptor";

/**
 *
 * all application interceptors placed at this array
 */
const interceptors = [
    batchInterceptor,
]

const addInterceptors = instance => {
    interceptors.forEach(interceptor=>{
        interceptor(instance);
    })
}

export default addInterceptors;
