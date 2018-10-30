import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    //component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    component: resolve => require(['../components/page/Main.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/waithanding',
                    //component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    component: resolve => require(['../components/page/WaitHanding.vue'], resolve),
                    meta: { title: '公司订单查询' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
