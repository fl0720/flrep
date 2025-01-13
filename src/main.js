import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./utils/dayjs";
//自动设置html标签字体大小
import "amfe-flexible"
import '@/assets/iconfont/iconfont.css'

import Vant from "vant";
import "vant/lib/index.css";

import "./assets/scss/index.scss"
import _ from 'lodash';

import {suposUtils} from "./utils/login";
Vue.prototype._ = _;
Vue.use(Vant);

// new Vue({
// 	store,
// 	router,
// 	render: (h) => h(App)
// }).$mount("#app");

async function login(){
	await suposUtils.accessToken();
	new Vue({
		store,
		router,
		render: h => h(App)
	}).$mount('#app')
}
login();
