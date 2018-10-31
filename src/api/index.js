import axios from 'axios';

let base = 'http://api.yx101.cn/hycDevelop';

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
