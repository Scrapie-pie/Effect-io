import Vue from 'vue'
import axios from 'axios'
import config from "@/config/index";
import store from "@/store/store"



// Настройки http-запросов
axios.defaults.baseURL = config.api_server;
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use(function (config) {
    config.url='app.php?'+config.url
    //store.commit('loading',true) //Todo loader переделать
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});



export default axios