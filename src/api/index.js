import axios from 'axios';

//let base = 'http://api.yx101.cn/hycDevelop';//正式接口地址
let base = 'http://localhost:8888/hycDevelop';//本地測試地址


//登录接口
export const requestLogin = params => { return axios.post(`${base}/login/`, params).then(res => res.data); };

//获取维修单
export const getOrder = (page,prepage,filter) => {
    return axios.get(`${base}/api/order/?pageNum=${page}&pageSize=${prepage}&filter=${JSON.stringify(filter)}` );
}

//获取全部维修人员分页信息
export const getAllMaintenance = () =>{
    return axios.get(`${base}/api/maintenance`)
}

//修改维修单
export const updateOrder = (id,params) => {
    return axios.put(`${base}/api/order/${id}`,params);
}

//发送报价 http://api.yx101.cn/hycDevelop/send/price
//{"title":"维修价格","orderId":"154105374726676","content":"门出问题了","openID":"oQBciw2BV7CxY7zAxkx-yzEboppI","order_id":"5bda9d33a8cb963909ccf484"}
export const sendPrices = (params) => {
    return axios.post(`${base}/send/price`,params)
}
