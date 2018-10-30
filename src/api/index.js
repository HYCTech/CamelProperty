import axios from 'axios';

let base = 'http://api.yx101.cn/hycDevelop';

//登录接口
export const requestLogin = params => { return axios.post(`${base}/login/`, params).then(res => res.data); };

//获取维修单
export const getOrder = (page,prepage,filter) => {
    return axios.get(`${base}/api/order/?pageNum=${page}&pageSize=${prepage}&filter=${JSON.stringify(filter)}` );
}
