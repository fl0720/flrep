export default [

    { path: '/', component: ()=>import("@/views") },
    { path: '/gateway', component: ()=>import("@/views/gateway") },
    { path: '/sensor', component: ()=>import("@/views/sensor")  },
    { path: '/device', component: ()=>import("@/views/intelligentDevice")  },
    // //重定向
    // {
    //     path: "/",
    //     component: () =>
    //         import(/* webpackChunkName: "article" */ "@/views/home/"),
    //     name: "home",
    //     props: true
    // },
    //
    // {
    //     path: "/test1",
    //     component: () =>
    //         import(
    //             /* webpackChunkName: "login_home_welcome" */ "@/views/test1/test1"
    //             ),
    //     name: "test1"
    // },
    // // //导入登录组件
    // {
    //     path: "/login",
    //     component: () =>
    //         import(
    //             /* webpackChunkName: "login_home_welcome" */ "@/views/login/"
    //             ),
    //     name: "login"
    // },
    // //导入article
    // {
    //     path: "/article/:articleId",
    //     component: () =>
    //         import(/* webpackChunkName: "article" */ "@/views/article/"),
    //     name: "article",
    //     props: true
    // },
    // //导入search
    // {
    //     path: "/search",
    //     component: () =>
    //         import(/* webpackChunkName: "search" */ "@/views/search/"),
    //     name: "search"
    // },
    // //用户资料UserProfile
    // {
    //     path: "/user/profile",
    //     component: () =>
    //         import(
    //             /* webpackChunkName: "user_profile" */ "@/views/user-profile/"
    //             ),
    //     name: "user-profile"
    // },
    // {
    //     path: "/",
    //     component: () =>
    //         import(
    //             /* webpackChunkName: "login_home_welcome" */ "@/views/layout/"
    //             ),
    //     name: "layout",
    //     children: [
    //         {
    //             path: "/", //默认子路由
    //             component: () =>
    //                 import(
    //                     /* webpackChunkName: "login_home_welcome" */ "@/views/home/"
    //                     )
    //         },
    //         {
    //             path: "/home",
    //             component: () =>
    //                 import(
    //                     /* webpackChunkName: "login_home_welcome" */ "@/views/home/"
    //                     )
    //         },
    //         {
    //             path: "/gateway",
    //             component: () =>
    //                 import(
    //                     /* webpackChunkName: "login_home_welcome" */ "@/views/gateway/"
    //                     )
    //         },
    //         {
    //             path: "/my",
    //             component: () =>
    //                 import(
    //                     /* webpackChunkName: "login_home_welcome" */ "@/views/my/"
    //                     )
    //         },
    //         {
    //             path: "/sensor",
    //             component: () =>
    //                 import(
    //                     /* webpackChunkName: "login_home_welcome" */ "@/views/sensor/"
    //                     )
    //         }
    //     ]
    // }
];
