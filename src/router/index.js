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
                    meta: { title: '订单管理' }
                },
                {
                    path: '/pendinghanding',
                    component: resolve => require(['../components/page/PendingHanding.vue'], resolve),
                    meta: { title: '派单管理' }
                },
                {
                    path: '/repairinghanding',
                    component: resolve => require(['../components/page/RepairingHanding.vue'], resolve),
                    meta: { title: '打印管理' }
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
