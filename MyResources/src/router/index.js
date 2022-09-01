import Vue from 'vue'
import Router from 'vue-router'
import axios from "axios";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Main from "../components/Main";
import Index from "../components/Index";
import Audio from "../components/Audio";
import Image from "../components/Image";
import Video from "../components/Video";
import Login from "../components/Login";
import User from "../components/User";

Vue.prototype.$http=axios
Vue.use(Router)
Vue.use(ElementUI)

export default new Router({
    routes: [
        {path: '/', redirect: '/login'},
        {
            path: '/main', component: Main,
            children: [
                {path: 'index', component: Index},
                {path: 'audio', component: Audio},
                {path: 'image', component: Image},
                {path: 'video', component: Video}
            ]
        },
        {path: '/login', component: Login},
        {path: '/user', component: User}
    ]
})
