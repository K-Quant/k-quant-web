import axios from '../request'

//注册接口
export const listHotMapShowData = (time)=> axios.get("http://127.0.0.1:5000/listHotMapShowData?",{
    params: {
        time:time
    }
})

//注册接口
export const findDataByTimeAndLocation = (bodao)=> axios.get("http://127.0.0.1:5000/findDodaoDataByTimeAndLocation?",{
    params: {
        time:bodao.time,
        latitude:bodao.latitude,
        longitude:bodao.longitude
    }
})

//注册接口
export const predict_test = (predict_bodao)=> axios.get("http://127.0.0.1:5000/predict_test?",{
    params: {
        latitude:predict_bodao.latitude,
        longitude:predict_bodao.longitude
    }
})

//注册接口
export const multi_predict_test = (predict_bodao)=> axios.get("http://127.0.0.1:5000/multi_predict_test?",{
    params: {
        latitude:predict_bodao.latitude,
        longitude:predict_bodao.longitude,
        step:predict_bodao.step
    }
})

